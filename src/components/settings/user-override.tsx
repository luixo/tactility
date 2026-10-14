import React, { useState } from "react";
import { Button, Input, Label } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { UserContext, setUserId } from "~/contexts/user-id-context";
import type { UserId } from "~/server/validation";
import { getAvatar } from "~/utils/names";

const uuidLength = crypto.randomUUID().length;

export const UserOverride = () => {
	const { t } = useTranslation();
	const [user, setUser] = React.use(UserContext);
	const queryClient = useQueryClient();
	const [localUserId, setLocalUserId] = useState<UserId>(user.id);
	const avatar = getAvatar(localUserId, null, user.name);
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				<Label htmlFor="input-type-email">
					{t("accountSettings.override.label")}
				</Label>
				<div className="flex flex-row gap-1">
					<Input
						value={localUserId}
						aria-label={t("accountSettings.override.label")}
						onChange={(event) => {
							setLocalUserId(event.currentTarget.value as UserId);
						}}
						minLength={uuidLength}
						maxLength={uuidLength}
						className="flex-1"
					/>
					<Button
						className="z-10"
						variant="secondary"
						size="sm"
						style={{ borderColor: avatar.color, color: avatar.color }}
					>
						{avatar.name}
					</Button>
				</div>
			</div>

			<Button
				className="z-10"
				variant="secondary"
				onPress={async () => {
					await setUserId(localUserId);
					setUser((prevUser) => ({ ...prevUser, id: localUserId }));
					queryClient.clear();
				}}
			>
				{t("accountSettings.override.button")}
			</Button>
		</div>
	);
};
