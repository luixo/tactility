import React from "react";
import { Modal } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { IoSettings as GearIcon } from "react-icons/io5";
import { LangSwitcher } from "~/components/settings/lang-switcher";

export const Settings = () => {
	const { t } = useTranslation();
	const [isOpen, setOpen] = React.useState(false);

	return (
		<Modal isOpen={isOpen} onOpenChange={setOpen}>
			<GearIcon
				className="cursor-pointer"
				size={24}
				onClick={() => setOpen(true)}
			/>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{t("settings.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						<LangSwitcher />
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal>
	);
};
