import { addEvent, getEvents } from "@/lib/schedule";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  return Response.json(await getEvents({ includeHidden: true }));
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const created = await addEvent({
    date: body.date || "2026-10-01",
    startTime: body.startTime || "9:00",
    endTime: body.endTime || "10:30",
    duration: body.duration || "2h00m",
    groupName: body.groupName || "ZPzWAI (ZARZ) 1st 3sem WykS",
    subject: body.subject || "Testowe zajęcia",
    form: body.form || "Wyk",
    room: body.room || "S47 120",
    teacher: body.teacher || "mgr IDEIS Test",
    credit: body.credit || "Zaliczenie ocena",
    prowgrId: body.prowgrId || "72217",
    notes: body.notes || "",
    hidden: Boolean(body.hidden),
  });
  return Response.json(created, { status: 201 });
}
