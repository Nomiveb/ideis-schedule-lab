import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const cookieName = "ideis_admin_session";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  const password = getAdminPassword();
  if (!password) return "";
  return process.env.ADMIN_SESSION_SECRET || password;
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function constantTimeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export async function isAdminPasswordValid(input: string) {
  const password = getAdminPassword();
  if (!password) return false;
  return constantTimeEqual(hash(input), hash(password));
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const nonce = randomBytes(16).toString("hex");
  const signature = hash(`${nonce}:${getSessionSecret()}`);

  cookieStore.set(cookieName, `${nonce}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function hasAdminSession() {
  const secret = getSessionSecret();
  if (!secret) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(cookieName)?.value || "";
  const [nonce, signature] = session.split(".");
  if (!nonce || !signature) return false;

  const expected = hash(`${nonce}:${secret}`);
  return constantTimeEqual(signature, expected);
}

export async function requireAdminSession() {
  if (await hasAdminSession()) return null;
  return Response.json({ error: "Admin password required" }, { status: 401 });
}
