import Link from "next/link";

export default function Home() {
  return (
    <main className="home-shell">
      <h1>IDEIS Test Schedule &amp; Calendar Sync</h1>
      <p style={{ color: "#5b6775", margin: "8px 0 24px" }}>
        Development and staging environment for IDEIS academic timetable integration and calendar sync testing.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <section>
          <h2 style={{ fontSize: "18px", color: "#12385f", marginBottom: "12px" }}>Timetable Views</h2>
          <nav style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/Plany/PlanyTokow/1406">Open schedule (Tok 1406)</Link>
            <Link href="/Plany/PlanyTokow/1203">Open schedule (Tok 1203)</Link>
            <Link href="/admin">Open admin</Link>
          </nav>
        </section>

        <section style={{ borderTop: "1px solid #ccd8e6", paddingTop: "20px" }}>
          <h2 style={{ fontSize: "16px", color: "#12385f", marginBottom: "8px" }}>Legal &amp; Policy Information</h2>
          <p style={{ fontSize: "14px", color: "#5b6775", marginBottom: "12px" }}>
            In compliance with Google API Services User Data Policy:
          </p>
          <nav style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
        </section>

        <footer style={{ borderTop: "1px solid #ccd8e6", paddingTop: "16px", fontSize: "13px", color: "#6b7280" }}>
          Operator Contact: <code>tpglee858@gmail.com</code> | Independent educational development tool.
        </footer>
      </div>
    </main>
  );
}
