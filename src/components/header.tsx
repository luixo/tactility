import type React from "react";
import type { PropsWithChildren } from "react";
import { useRouter } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { AccountSettings } from "~/components/settings/account-settings";
import { ModeSwitch } from "~/components/settings/mode-switch";
import { Settings } from "~/components/settings/settings";

const HEADER_PORTAL_ID = "header-children";

export const HeaderPortal: React.FC<PropsWithChildren> = ({ children }) => (
	// oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
	<>{createPortal(children, document.querySelector(`#${HEADER_PORTAL_ID}`)!)}</>
);

export const Header: React.FC = () => {
	const router = useRouter();
	return (
		<div className="items-cneter flex justify-between gap-4">
			<button
				type="button"
				className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded bg-conic/decreasing from-blue-200 via-pink-500 to-pink-800 text-xl font-extrabold"
				onClick={() => router.navigate({ to: "/" })}
			>
				TCT
			</button>
			<div
				id={HEADER_PORTAL_ID}
				className="flex flex-col items-center justify-center"
			/>
			<div className="flex flex-row items-center gap-4 p-4">
				<ModeSwitch />
				<AccountSettings />
				<Settings />
			</div>
		</div>
	);
};
