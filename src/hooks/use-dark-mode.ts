import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { useMounted } from "~/hooks/use-mounted";

export const useDarkMode = () => {
	const [mode, setMode] = useLocalStorage<"light" | "dark" | "auto">(
		"color-mode",
		"auto",
	);
	const isMounted = useMounted();
	const [autoMode] = React.useState<"light" | "dark">(() => {
		if (typeof window === "undefined") {
			return "light";
		}
		return window.matchMedia("(prefers-color-scheme:dark)").matches
			? "dark"
			: "light";
	});
	const actualMode = mode === "auto" ? autoMode : mode;
	React.useEffect(() => {
		document.documentElement.classList.toggle("dark", actualMode === "dark");
	}, [actualMode]);
	return [isMounted ? actualMode : "auto", setMode] as const;
};
