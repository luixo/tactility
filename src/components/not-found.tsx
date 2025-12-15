import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <Link to="/" className="text-gray-300 underline">
        {t("common.404.home")}
      </Link>
      <div className="flex flex-col">
        <h1 className="text-9xl font-bold">{t("common.404.header")}</h1>
        <h2 className="text-4xl font-bold">{t("common.404.title")}</h2>
      </div>
    </div>
  );
};
