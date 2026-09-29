"use client";

import { useState } from "react";

export function IdeisClient({ initialGrid }: { initialGrid: string }) {
  const [grid, setGrid] = useState(initialGrid);
  const [loading, setLoading] = useState(false);

  async function search(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setLoading(true);
    const dateFrom = (document.querySelector("#DataOd_I") as HTMLInputElement | null)?.value || "";
    const dateTo = (document.querySelector("#DataDo_I") as HTMLInputElement | null)?.value || "";
    const params = new URLSearchParams({ dateFrom, dateTo });
    const response = await fetch(`/Plany/PlanyTokowGrid?${params.toString()}`, { cache: "no-store" });
    setGrid(await response.text());
    setLoading(false);
  }

  return (
    <>
      <div className="toolbar">
        <label>
          Data od
          <input id="DataOd_I" defaultValue="02/02/2026" />
        </label>
        <label>
          Data do
          <input id="DataDo_I" defaultValue="09/30/2026" />
        </label>
        <a id="SzukajLogout" href="/Plany/PlanyTokowGrid" onClick={search}>
          Search
        </a>
        {loading ? <span className="loading">Loading...</span> : null}
      </div>
      <div id="gridContainer" dangerouslySetInnerHTML={{ __html: grid }} />
    </>
  );
}
