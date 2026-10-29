import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="home-shell" style={{ maxWidth: 800, lineHeight: 1.6 }}>
      <p><Link href="/">&larr; Back to Home</Link></p>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: October 29, 2026</em></p>

      <h2>1. Overview</h2>
      <p>
        <strong>IDEIS Test Sync &amp; Schedule Lab</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;)
        is an academic testing and timetable synchronization tool operated by an independent student developer
        (contact: <code>tpglee858@gmail.com</code>).
      </p>

      <h2>2. Information We Process</h2>
      <p>We process the minimal necessary technical data strictly required to test and operate calendar synchronization:</p>
      <ul>
        <li><strong>Google Account Email:</strong> To identify connected accounts in staging environments.</li>
        <li><strong>OAuth 2.0 Credentials:</strong> Refresh tokens are stored securely and used solely for Google Calendar API interactions.</li>
        <li><strong>Test Timetable Events:</strong> Staging schedule events created within the designated test Google Calendar (&quot;Ideis test&quot;).</li>
      </ul>

      <h2>3. Google API Services User Data Policy Compliance</h2>
      <p>
        Our use and transfer of information received from Google APIs adheres to the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
          Google API Services User Data Policy
        </a>, including the Limited Use requirements:
      </p>
      <ul>
        <li>We only request calendar permissions necessary to insert, update, or remove test timetable events in user-authorized calendars.</li>
        <li>We do not read, modify, or inspect your unrelated personal calendar entries.</li>
        <li>We do not sell, rent, or transfer user data to third parties or advertising platforms.</li>
        <li>User data is not used for training artificial intelligence or machine learning models.</li>
      </ul>

      <h2>4. Data Retention and Revocation</h2>
      <p>
        Users can revoke access at any time through their Google Account security settings at{" "}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
          myaccount.google.com/permissions
        </a>.
      </p>

      <h2>5. Contact</h2>
      <p>
        For inquiries regarding privacy or data handling, contact: <code>tpglee858@gmail.com</code>.
      </p>
    </main>
  );
}
