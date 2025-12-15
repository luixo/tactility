import React from "react";

import { useSessionStorage } from "usehooks-ts";

import { SessionContext } from "~/contexts/session-context";
import { UserContext } from "~/contexts/user-id-context";
import type { upsertUser } from "~/server/user";
import { SESSION_ID_KEY } from "~/utils/auth";

const randomSessionId = `session-${Math.random()}`;
type User = Awaited<ReturnType<typeof upsertUser>>;
export const SessionWrapper: React.FC<{
  initialUser: User;
  children: (opts: { userId: User["id"] }) => React.ReactNode;
}> = ({ children, initialUser }) => {
  const userState = React.useState(initialUser);
  const [sessionId, setSessionId] = useSessionStorage(
    SESSION_ID_KEY,
    randomSessionId,
  );
  const userId = userState[0].id;
  React.useEffect(() => {
    setSessionId(sessionId);
  }, [sessionId, setSessionId]);
  return (
    <SessionContext value={sessionId}>
      <UserContext value={userState}>{children({ userId })}</UserContext>
    </SessionContext>
  );
};
