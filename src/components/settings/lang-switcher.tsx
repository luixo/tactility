import { Button } from "@heroui/react";
import { keys } from "remeda";
import { useTranslation } from "~/utils/i18n";
import type { Language } from "~/utils/language";
import { languages } from "~/utils/language";

const LOCALE_NAMES: Partial<Record<Language, string>> = {
	ru: "Русский",
	en: "English",
};

export const LangSwitcher = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { changeLanguage } = useTranslation();
	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-lg">{t("settings.langSwitcher.title")}</h3>
			<div className="flex flex-row gap-1">
				{keys(languages).map((lang) => (
					<Button
						key={lang}
						variant="primary"
						onPress={() => changeLanguage(lang)}
						isDisabled={lang === i18n.language}
					>
						{LOCALE_NAMES[lang] ?? "unknown"}
					</Button>
				))}
			</div>
		</div>
	);
};
