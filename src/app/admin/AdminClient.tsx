"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ScheduleEvent } from "@/lib/schedule";

const blankEvent: Omit<ScheduleEvent, "id"> = {
  date: "2026-10-01",
  startTime: "9:00",
  endTime: "10:30",
  duration: "2h00m",
  groupName: "ZPzWAI (ZARZ) 1st 3sem ĆwS",
  subject: "AI w prowadzeniu działalności gospodarczej",
  form: "Cw",
  room: "S47 120",
  teacher: "mgr Anna Gierasimowicz",
  credit: "Zaliczenie ocena",
  prowgrId: "72217",
  notes: "Brak",
  hidden: false,
};

export function AdminClient() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [newEvent, setNewEvent] = useState(blankEvent);
  const [savingId, setSavingId] = useState("");

  async function loadEvents() {
    const response = await fetch("/api/events", { cache: "no-store" });
    setEvents(await response.json());
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialEvents() {
      const response = await fetch("/api/events", { cache: "no-store" });
      const nextEvents = await response.json();
      if (!cancelled) setEvents(nextEvents);
    }

    void loadInitialEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  async function save(id: string, patch: Partial<ScheduleEvent>) {
    setSavingId(id);
    await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    await loadEvents();
    setSavingId("");
  }

  async function createEvent() {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    setNewEvent(blankEvent);
    await loadEvents();
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p>IDEIS Schedule Lab</p>
          <h1>Admin</h1>
        </div>
        <Link href="/Plany/PlanyTokow/1406">Public schedule</Link>
      </header>

      <section className="admin-create">
        <h2>Add class</h2>
        <div className="admin-grid">
          {(["date", "startTime", "endTime", "groupName", "subject", "room", "teacher", "notes"] as const).map((field) => (
            <label key={field}>
              {field}
              <input
                value={newEvent[field]}
                onChange={(event) => setNewEvent({ ...newEvent, [field]: event.target.value })}
              />
            </label>
          ))}
        </div>
        <button onClick={createEvent}>Add</button>
      </section>

      <section className="admin-list">
        <h2>Classes</h2>
        <div className="event-table">
          {events.map((event) => (
            <article key={event.id} className={event.hidden ? "event-row hidden-row" : "event-row"}>
              <div className="event-meta">
                <strong>{event.subject}</strong>
                <span>{event.date} {event.startTime}-{event.endTime}</span>
                <span>{event.groupName}</span>
              </div>
              <label>
                Time
                <input
                  defaultValue={event.startTime}
                  onBlur={(input) => save(event.id, { startTime: input.currentTarget.value })}
                />
              </label>
              <label>
                Room
                <input
                  defaultValue={event.room}
                  onBlur={(input) => save(event.id, { room: input.currentTarget.value })}
                />
              </label>
              <label>
                Teacher
                <input
                  defaultValue={event.teacher}
                  onBlur={(input) => save(event.id, { teacher: input.currentTarget.value })}
                />
              </label>
              <label>
                Notes
                <input
                  defaultValue={event.notes}
                  onBlur={(input) => save(event.id, { notes: input.currentTarget.value })}
                />
              </label>
              <button onClick={() => save(event.id, { hidden: !event.hidden })}>
                {event.hidden ? "Show" : "Hide"}
              </button>
              {savingId === event.id ? <span>Saving</span> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
