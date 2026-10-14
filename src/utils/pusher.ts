import React from "react";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import type { SuperJSONResult } from "superjson";
import { useEventCallback } from "usehooks-ts";
import { SessionContext } from "~/contexts/session-context";
import type { GameId } from "~/server/validation";
import type { SubscriptionMapping } from "~/types/subscription";
import { transformer } from "~/utils/transformer";

export const getChannelName = (gameId: GameId) => `game-${gameId}`;

const {
	VITE_PUSHER_APP_KEY = "",
	VITE_PUSHER_CLUSTER = "",
	VITE_PUSHER_HOST = "",
} = import.meta.env;

let pusherInstance: Pusher | undefined;
const getPusherInstance = (): Pusher => {
	pusherInstance ??= new Pusher(VITE_PUSHER_APP_KEY, {
		cluster: VITE_PUSHER_CLUSTER,
		enabledTransports: ["ws", "wss"],
		forceTLS: true,
		wsHost: VITE_PUSHER_HOST,
	});
	return pusherInstance;
};

const channelSubscriptions: Record<
	string,
	{ channel: Channel; subscribers: ((data: SuperJSONResult) => void)[] }
> = {};

const useChannel = (channelName: string) => {
	const [instance] = React.useState(() => getPusherInstance());
	return useEventCallback(
		(event: string, onData: (data: SuperJSONResult) => void) => {
			if (!channelSubscriptions[channelName]) {
				channelSubscriptions[channelName] = {
					channel: instance.subscribe(channelName),
					subscribers: [],
				};
			}
			const channelObject = channelSubscriptions[channelName];
			channelObject.subscribers.push(onData);
			channelObject.channel.bind(event, onData);
			return () => {
				channelObject.channel.unbind(event, onData);
				channelObject.subscribers = channelObject.subscribers.filter(
					(fn) => fn !== onData,
				);
				if (channelObject.subscribers.length === 0) {
					instance.unsubscribe(channelName);
					delete channelSubscriptions[channelName];
				}
			};
		},
	);
};

const timestamps: Partial<Record<keyof SubscriptionMapping, number>> = {};

export const useBindSubscription = (channelName: string) => {
	const ourSessionId = React.use(SessionContext);
	const subscribeChannel = useChannel(channelName);
	return useEventCallback(
		<K extends keyof SubscriptionMapping>(
			event: K,
			onData: (data: SubscriptionMapping[K]) => void,
		) =>
			subscribeChannel(event, (data: SuperJSONResult) => {
				const { timestamp, sessionId, ...deserializedData } =
					transformer.deserialize(data) as SubscriptionMapping[K] & {
						timestamp: number;
						sessionId: string;
					};
				if (sessionId === ourSessionId) {
					return;
				}
				const lastTimestamp = timestamps[event];
				if (lastTimestamp && lastTimestamp > timestamp) {
					return;
				}
				timestamps[event] = timestamp;
				onData(deserializedData);
			}),
	);
};
