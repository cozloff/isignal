import { createCookieSessionStorage, createCookie } from "react-router";
import { redirect } from "react-router";

type SessionData = {
  jwtToken: string;
  refreshToken: string;
  userId: string;
  name: string;
  role: string[];
  attested?: boolean;
};

type SessionFlashData = {
  error: string;
};

const sessionSecret = process.env.VITE_SESSION_SECRET ?? "s3cret1";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60000,
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: process.env.VITE_ENVIORNMENT === "production",
    },
  });

export { getSession, commitSession, destroySession };

export async function requireUser(request: Request) {
  const session = await getValidatedSession(request);
  const userId = session.get("userId") as string;
  const name = session.get("name") as string;
  const role = session.get("role") as string[];
  return { userId, name, role };
}

export async function checkPermission(request: Request, role: string) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const roles = session.get("role");
  if (!roles?.includes(role)) throw redirect("/request-access");

  return;
}

export async function getValidatedSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  const userId = session.get("userId");
  const name = session.get("name");
  const role = session.get("role");

  if (!userId || !name || !role) {
    console.warn(
      "Invalid session detected. Clearing cookie and redirecting to login."
    );

    const headers = new Headers();
    headers.append("Set-Cookie", await destroySession(session));

    throw redirect("/login", { headers });
  }

  return session;
}

export const sasCookie = createCookie("sasToken", {
  httpOnly: true,
});
