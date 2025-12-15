import type { UserId } from "~/server/validation";

export type SubscriptionMapping = {
  "game:start": {
    teamIds: UserId[];
  };
};
