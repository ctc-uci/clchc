import React, { useState } from "react";

import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";

import {
  useDeleteUserByFirebaseUid,
  useUpdateUserByFirebaseUid,
} from "@/contexts/hooks/data-fetching/useUsers.js";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";

import StepFinalize from "./transfer-master/StepFinalize.jsx";
import StepReviewTransfer from "./transfer-master/StepReviewTransfer.jsx";
import StepSelectUser from "./transfer-master/StepSelectUser.jsx";
import TransferModalHeader from "./transfer-master/TransferModalHeader.jsx";


export default function TransferMasterRoleModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { currentUser, logout } = useAuthContext();
  const [step, setStep] = useState(1);
  const [option, setOption] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { mutateAsync: deleteUser } = useDeleteUserByFirebaseUid();
  const { mutateAsync: updateUser } = useUpdateUserByFirebaseUid();

  const update = async () => {
  if (!selectedUser) return;

  if (option === "delete") {
    try {
        console.log(selectedUser)
      await updateUser({ uid: selectedUser, data: { role: "master" } });
    } catch (error) {
      console.error("Error transferring master role:", error);
      return;
    }
    try {
      await deleteUser(currentUser.uid);
      logout();
    } catch (error) {
      console.error("Error deleting user:", error);
      return;
    }

  } else if (option === "ccm") {
    try {
      await updateUser({ uid: selectedUser, data: { role: "master" } });
    } catch (error) {
      console.error("Error transferring master role:", error);
      return;
    }
    try {
      await updateUser({ uid: currentUser.uid, data: { role: "ccm" } });
    } catch (error) {
      console.error("Error downgrading own role:", error);
    }
  }
};

  const stepMap = {
    1: (
      <StepSelectUser
        onClose={() => {
          onClose();
          setStep(1);
        }}
        onSelect={setSelectedUser}
        onNext={() => setStep(2)}
      />
    ),
    2: (
      <StepReviewTransfer
        onClose={() => {
          onClose();
          setStep(1);
        }}
        selectedUid={selectedUser}
        onNext={() => setStep(3)}
      />
    ),
    3: (
      <StepFinalize
        onClose={() => {
          onClose();
          setStep(1);
        }}
        onSelect={setOption}
        onFinalize={async () => {
          await update();
          onClose();
          setStep(1);
          queryClient.invalidateQueries(["currentUser"]);
          queryClient.invalidateQueries(["users"]);
        }}
      />
    ),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      //   size="full"
    >
      <ModalOverlay />
      <ModalContent
        padding="1em"
        minW="700px"
        minH="500px"
      >
        <TransferModalHeader step={step} />
        <ModalBody>{stepMap[step]}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
