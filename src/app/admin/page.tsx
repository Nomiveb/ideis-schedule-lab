import Link from "next/link";
import { AdminClient } from "./AdminClient";
import {
  createAdminSession,
  hasAdminSession,
  isAdminPasswordConfigured,
  isAdminPasswordValid,
} from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";

  const password = String(formData.get("password") || "");
  if (!(await isAdminPasswordValid(password))) {
    redirect("/admin?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

function AdminLogin({ error }: { error: boolean }) {
  const configured = isAdminPasswordConfigured();

  return (
    <main className="admin-shell">
      <section className="admin-login">
        <p>IDEIS Schedule Lab</p>
        <h1>Admin password</h1>
        {configured ? (
          <form action={login}>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required autoFocus />
            </label>
            {error ? <span className="admin-error">Wrong password.</span> : null}
            <button type="submit">Enter admin</button>
          </form>
        ) : (
          <div className="admin-error">
            ADMIN_PASSWORD is not configured. Add it in Vercel Environment Variables.
          </div>
        )}
        <Link href="/Plany/PlanyTokow/1406">Public schedule</Link>
      </section>
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (!(await hasAdminSession())) {
    return <AdminLogin error={params.error === "1"} />;
  }

  return <AdminClient />;
}
