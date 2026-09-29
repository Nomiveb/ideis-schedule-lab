import { renderScheduleGrid } from "@/lib/grid";
import { getEvents } from "@/lib/schedule";

export const dynamic = "force-dynamic";

function normalizeDateParam(value: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return trimmed;

  const dotted = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotted) return `${dotted[3]}-${dotted[2]}-${dotted[1]}`;

  const slash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    const month = slash[1].padStart(2, "0");
    const day = slash[2].padStart(2, "0");
    return `${slash[3]}-${month}-${day}`;
  }

  return undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const events = await getEvents({
    dateFrom: normalizeDateParam(url.searchParams.get("dateFrom")),
    dateTo: normalizeDateParam(url.searchParams.get("dateTo")),
  });
  return new Response(renderScheduleGrid(events), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
