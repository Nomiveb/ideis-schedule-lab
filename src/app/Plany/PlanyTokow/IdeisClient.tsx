"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function IdeisClient({
  initialGrid,
  tok,
  initialDateFrom = "15.09.2026",
  initialDateTo = "15.02.2027",
}: {
  initialGrid: string;
  tok?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
}) {
  const [grid, setGrid] = useState(initialGrid);
  const [loading, setLoading] = useState(false);
  const inCallbackRef = useRef(false);

  useEffect(() => {
    const toDotted = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    g.MVCxDataOd = {
      SetDate: (d: Date) => {
        const input = document.querySelector("#DataOd_I") as HTMLInputElement | null;
        if (input) input.value = toDotted(d);
      },
    };
    g.MVCxDataDo = {
      SetDate: (d: Date) => {
        const input = document.querySelector("#DataDo_I") as HTMLInputElement | null;
        if (input) input.value = toDotted(d);
      },
    };
    g.gridViewPlanyTokow = {
      InCallback: () => inCallbackRef.current,
    };
  }, []);

  async function search(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    inCallbackRef.current = true;
    setLoading(true);
    try {
      const dateFrom = (document.querySelector("#DataOd_I") as HTMLInputElement | null)?.value || "";
      const dateTo = (document.querySelector("#DataDo_I") as HTMLInputElement | null)?.value || "";
      const params = new URLSearchParams({ dateFrom, dateTo });
      const gridEndpoint = tok ? `/Plany/PlanyTokowGrid/${tok}?${params.toString()}` : `/Plany/PlanyTokowGrid?${params.toString()}`;
      const response = await fetch(gridEndpoint, { cache: "no-store" });
      const html = await response.text();
      setGrid(html);
    } finally {
      inCallbackRef.current = false;
      setLoading(false);
    }
  }

  return (
    <>
      <div className="toolbar">
        <label>
          Data od
          <input id="DataOd_I" defaultValue={initialDateFrom} />
        </label>
        <label>
          Data do
          <input id="DataDo_I" defaultValue={initialDateTo} />
        </label>
        <Link id="SzukajLogout" href="/Plany/PlanyTokowGrid" onClick={search}>
          Search
        </Link>
        {loading ? <span className="loading">Loading...</span> : null}
      </div>
      <div id="gridContainer" dangerouslySetInnerHTML={{ __html: grid }} />
    </>
  );
}
