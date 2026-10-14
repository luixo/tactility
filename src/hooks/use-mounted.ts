import React from "react";

const subscribe = () => () => undefined;
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useMounted = () =>
	React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
