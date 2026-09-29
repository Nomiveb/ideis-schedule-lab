import { neon } from "@neondatabase/serverless";
import fs from "node:fs/promises";
import path from "node:path";

export type ScheduleEvent = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  groupName: string;
  subject: string;
  form: string;
  room: string;
  teacher: string;
  credit: string;
  prowgrId: string;
  notes: string;
  hidden: boolean;
};

const seedPath = path.join(process.cwd(), "data", "seed.csv");
const localStorePath = path.join(process.cwd(), ".data", "schedule.json");
const semesterStartDate = "2026-02-02";

function clean(value: string | undefined) {
  return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function compareEvents(a: ScheduleEvent, b: ScheduleEvent) {
  const dateCompare = a.date.localeCompare(b.date);
  if (dateCompare !== 0) return dateCompare;
  const timeCompare = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  if (timeCompare !== 0) return timeCompare;
  return a.id.localeCompare(b.id);
}

function isSeedEvent(event: Pick<ScheduleEvent, "id">) {
  return event.id.startsWith("seed-") || event.id.startsWith("semester-");
}

export async function readSeedEvents(): Promise<ScheduleEvent[]> {
  const text = await fs.readFile(seedPath, "utf8");
  const rows = text.split(/\r?\n/).filter(Boolean);
  const events: ScheduleEvent[] = [];

  for (const [rowIndex, row] of rows.entries()) {
    if (rowIndex === 0) continue;
    const cols = row.split(";");
    if (cols.length < 12) continue;

    events.push({
      id: `seed-${String(rowIndex).padStart(4, "0")}`,
      date: clean(cols[0]),
      startTime: clean(cols[1]),
      endTime: clean(cols[2]),
      duration: clean(cols[3]),
      groupName: clean(cols[4]),
      subject: clean(cols[5]),
      form: clean(cols[6]),
      room: clean(cols[7]),
      teacher: clean(cols[8]),
      credit: clean(cols[9]),
      prowgrId: clean(cols[10]),
      notes: clean(cols[11]),
      hidden: false,
    });
  }

  return events;
}

let sqlClient: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!process.env.DATABASE_URL) return null;
  if (!sqlClient) sqlClient = neon(process.env.DATABASE_URL);
  return sqlClient;
}

async function ensureSchema() {
  const sql = getSql();
  if (!sql) return false;

  await sql`
    CREATE TABLE IF NOT EXISTS schedule_events (
      id text PRIMARY KEY,
      date text NOT NULL,
      start_time text NOT NULL,
      end_time text NOT NULL,
      duration text NOT NULL,
      group_name text NOT NULL,
      subject text NOT NULL,
      form text NOT NULL,
      room text NOT NULL,
      teacher text NOT NULL,
      credit text NOT NULL,
      prowgr_id text NOT NULL,
      notes text NOT NULL,
      hidden boolean NOT NULL DEFAULT false
    )
  `;
  return true;
}

async function syncSeedDatabase(seed: ScheduleEvent[]) {
  const sql = getSql();
  if (!sql) return;

  // We can do it in batches of 100 to avoid query size limits
  for (let i = 0; i < seed.length; i += 100) {
    const batch = seed.slice(i, i + 100);
    const promises = batch.map(event => sql`
      INSERT INTO schedule_events (
        id, date, start_time, end_time, duration, group_name, subject, form,
        room, teacher, credit, prowgr_id, notes, hidden
      ) VALUES (
        ${event.id}, ${event.date}, ${event.startTime}, ${event.endTime},
        ${event.duration}, ${event.groupName}, ${event.subject}, ${event.form},
        ${event.room}, ${event.teacher}, ${event.credit}, ${event.prowgrId},
        ${event.notes}, ${event.hidden}
      )
      ON CONFLICT (id) DO UPDATE SET
        date = EXCLUDED.date,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        duration = EXCLUDED.duration,
        group_name = EXCLUDED.group_name,
        subject = EXCLUDED.subject,
        form = EXCLUDED.form,
        room = EXCLUDED.room,
        teacher = EXCLUDED.teacher,
        credit = EXCLUDED.credit,
        prowgr_id = EXCLUDED.prowgr_id,
        notes = EXCLUDED.notes,
        hidden = EXCLUDED.hidden
    `);
    await Promise.all(promises);
  }
}

async function readLocalEvents() {
  if (process.env.VERCEL) {
    return readSeedEvents();
  }

  let manualEvents: ScheduleEvent[] = [];
  try {
    const text = await fs.readFile(localStorePath, "utf8");
    manualEvents = (JSON.parse(text) as ScheduleEvent[]).filter((event) => !isSeedEvent(event));
  } catch {
    manualEvents = [];
  }

  const events = [...(await readSeedEvents()), ...manualEvents];
  try {
    await writeLocalEvents(events);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EROFS") throw error;
  }
  return events;
}

async function writeLocalEvents(events: ScheduleEvent[]) {
  await fs.mkdir(path.dirname(localStorePath), { recursive: true });
  await fs.writeFile(localStorePath, JSON.stringify(events, null, 2), "utf8");
}

function fromDb(row: Record<string, unknown>): ScheduleEvent {
  return {
    id: String(row.id),
    date: String(row.date),
    startTime: String(row.start_time),
    endTime: String(row.end_time),
    duration: String(row.duration),
    groupName: String(row.group_name),
    subject: String(row.subject),
    form: String(row.form),
    room: String(row.room),
    teacher: String(row.teacher),
    credit: String(row.credit),
    prowgrId: String(row.prowgr_id),
    notes: String(row.notes),
    hidden: Boolean(row.hidden),
  };
}

export async function getEvents(options: { includeHidden?: boolean; dateFrom?: string; dateTo?: string } = {}) {
  const inDateRange = (event: ScheduleEvent) => {
    if (options.dateFrom && event.date < options.dateFrom) return false;
    if (options.dateTo && event.date > options.dateTo) return false;
    return true;
  };

  if (await ensureSchema()) {
    const sql = getSql()!;
    const seed = await readSeedEvents();
    const countRes = (await sql`SELECT count(*) FROM schedule_events WHERE id LIKE 'seed-%' OR id LIKE 'semester-%'`) as Array<{ count: string | number }>;
    if (Number(countRes[0]?.count || 0) !== seed.length) {
      await sql`DELETE FROM schedule_events WHERE id LIKE 'seed-%' OR id LIKE 'semester-%'`;
      await syncSeedDatabase(seed);
    }
    const rows = (await sql`
      SELECT * FROM schedule_events
      WHERE (${options.includeHidden || false} OR hidden = false)
        AND (${options.dateFrom || null}::text IS NULL OR date >= ${options.dateFrom || null})
        AND (${options.dateTo || null}::text IS NULL OR date <= ${options.dateTo || null})
      ORDER BY date, start_time, id
    `) as Array<Record<string, unknown>>;
    return rows.map((row) => fromDb(row)).sort(compareEvents);
  }

  const events = await readLocalEvents();
  return events
    .filter((event) => options.includeHidden || !event.hidden)
    .filter(inDateRange)
    .sort(compareEvents);
}

export async function updateEvent(id: string, patch: Partial<ScheduleEvent>) {
  const current = await getEvents({ includeHidden: true });
  const existing = current.find((event) => event.id === id);
  if (!existing) throw new Error(`Event not found: ${id}`);

  const next = { ...existing, ...patch, id };

  if (await ensureSchema()) {
    const sql = getSql();
    await sql!`
      UPDATE schedule_events SET
        date = ${next.date},
        start_time = ${next.startTime},
        end_time = ${next.endTime},
        duration = ${next.duration},
        group_name = ${next.groupName},
        subject = ${next.subject},
        form = ${next.form},
        room = ${next.room},
        teacher = ${next.teacher},
        credit = ${next.credit},
        prowgr_id = ${next.prowgrId},
        notes = ${next.notes},
        hidden = ${next.hidden}
      WHERE id = ${id}
    `;
    return next;
  }

  await writeLocalEvents(current.map((event) => (event.id === id ? next : event)));
  return next;
}

export async function addEvent(input: Omit<ScheduleEvent, "id">) {
  const id = `manual-${Date.now()}`;
  const event = { ...input, id };

  if (await ensureSchema()) {
    const sql = getSql();
    await sql!`
      INSERT INTO schedule_events (
        id, date, start_time, end_time, duration, group_name, subject, form,
        room, teacher, credit, prowgr_id, notes, hidden
      ) VALUES (
        ${event.id}, ${event.date}, ${event.startTime}, ${event.endTime},
        ${event.duration}, ${event.groupName}, ${event.subject}, ${event.form},
        ${event.room}, ${event.teacher}, ${event.credit}, ${event.prowgrId},
        ${event.notes}, ${event.hidden}
      )
    `;
    return event;
  }

  const current = await readLocalEvents();
  await writeLocalEvents([...current, event]);
  return event;
}

export function toDottedDate(isoDate: string) {
  return isoDate.replaceAll("-", ".");
}

export { semesterStartDate };
