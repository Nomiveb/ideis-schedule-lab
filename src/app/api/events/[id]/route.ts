import { updateEvent } from "@/lib/schedule";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const updated = await updateEvent(id, body);
  return Response.json(updated);
}
