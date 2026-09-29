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
    date: body.date || "2026-05-19",
    startTime: body.startTime || "9:00",
    endTime: body.endTime || "10:30",
    duration: body.duration || "2h00m",
    groupName: body.groupName || "Zarządzanie 1st 2sem Ćw1S",
    subject: body.subject || "Testowe zajęcia",
    form: body.form || "Ćwiczenia",
    room: body.room || "LAB 001",
    teacher: body.teacher || "mgr IDEIS Test",
    credit: body.credit || "Zaliczenie ocena",
    prowgrId: body.prowgrId || `MANUAL-${Date.now()}`,
    notes: body.notes || "",
    hidden: Boolean(body.hidden),
  });
  return Response.json(created, { status: 201 });
}
