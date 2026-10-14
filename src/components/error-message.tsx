import type React from "react";
import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";

export const ErrorMessage: React.FC<{
	error: unknown;
}> = ({ error }) => {
	const { t } = useTranslation();
	return (
		<Card className="border-danger">
			<Card.Header>
				{t("common.error", {
					error:
						typeof error === "string"
							? error
							: typeof error === "object" && error instanceof Error
								? error.message
								: JSON.stringify(error, null, 4),
				})}
			</Card.Header>
		</Card>
	);
};
