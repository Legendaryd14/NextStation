import { ModalBody } from "@heroui/react";
import { Modal, ModalTrigger } from "../ui/animated-modal";
import { GooeyInput } from "../ui/gooey-input";

export function SearchButton() {
  return (
    <Modal>
      <ModalTrigger>Search</ModalTrigger>
      <ModalBody>
        <GooeyInput
          placeholder="Search..."
          collapsedWidth={200}
          expandedWidth={300}
          gooeyBlur={100}
          expandedOffset={100}
        />
      </ModalBody>
    </Modal>
  );
}
