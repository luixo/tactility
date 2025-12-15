import React from "react";

import { Modal } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { IoPerson as UserIcon } from "react-icons/io5";

import { UserOverride } from "~/components/settings/user-override";

export const AccountSettings = () => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <UserIcon
        className="cursor-pointer"
        size={24}
        onClick={() => setOpen(true)}
      />
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{t("accountSettings.title")}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <UserOverride />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
};
