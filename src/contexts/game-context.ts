import React from "react";

import type { getGame } from "~/server/handlers/games";

export type GameContextType = Awaited<ReturnType<typeof getGame>>;

export const GameContext = React.createContext<GameContextType | null>(null);
