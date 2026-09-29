import { renderScheduleGrid } from "@/lib/grid";
import { getEvents } from "@/lib/schedule";
import { IdeisClient } from "../IdeisClient";

export const dynamic = "force-dynamic";

export default async function IdeisSchedulePage1406() {
  const events = await getEvents();
  const initialGrid = renderScheduleGrid(events);

  return (
    <main className="ideis-shell">
      <header className="ideis-header">
        <div>
          <p>Harmonogramy</p>
          <h1>Plany Tokow</h1>
        </div>
        <a href="/admin">Admin</a>
      </header>
      <section className="ideis-panel">
        <h2>Zarzadzanie przedsiebiorstwem z wykorzystaniem AI (ZARZ) S lic. 3.00 2025/2026 Zima (Tok 1406)</h2>
        <IdeisClient initialGrid={initialGrid} tok="1406" />
      </section>
    </main>
  );
}
