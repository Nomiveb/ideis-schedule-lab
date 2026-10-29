import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="home-shell" style={{ maxWidth: 800, lineHeight: 1.6 }}>
      <p><Link href="/">&larr; Back to Home</Link></p>
      <h1>Terms of Service</h1>
      <p><em>Last updated: October 29, 2026</em></p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using <strong>IDEIS Test Sync &amp; Schedule Lab</strong>, you agree to be bound by these Terms of Service.
        This application is provided for educational, development, and timetable synchronization testing purposes.
      </p>

      <h2>2. Permitted Use</h2>
      <p>
        Users are permitted to view mock timetable data and test calendar synchronization for their personal educational schedules.
      </p>

      <h2>3. Disclaimer of Warranties</h2>
      <p>
        The service is provided &quot;as is&quot; without warranty of any kind. Timetable data reflects testing and staging records.
      </p>

      <h2>4. Contact</h2>
      <p>
        If you have questions about these Terms, reach out to <code>tpglee858@gmail.com</code>.
      </p>
    </main>
  );
}
