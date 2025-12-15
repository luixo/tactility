import { serialize } from "cookie";

import type { UserId } from "~/server/validation";
import { USER_ID_COOKIE } from "~/utils/auth";
import { YEAR } from "~/utils/time";

export const getAuthCookie = (id: UserId) => `${USER_ID_COOKIE}=${id}`;

export const getSetAuthCookie = (id: UserId, expirationDate: Date) =>
  serialize(USER_ID_COOKIE, id, {
    expires: expirationDate,
    path: "/",
    secure: true,
  });

export const getExtendedAuthCookie = (id: UserId) =>
  ["set-cookie", getSetAuthCookie(id, new Date(Date.now() + YEAR))] as const;
