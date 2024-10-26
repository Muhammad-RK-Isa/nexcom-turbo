import { lucia } from "./lucia";

export async function getUser(cookieHeader: string) {
  const sessionId = lucia.readSessionCookie(cookieHeader);

  if (sessionId) {
    const {session, user} = await lucia.validateSession(sessionId);
    
    return { session, user }
  }
  return {
    session: null,
    user: null,
  }
}