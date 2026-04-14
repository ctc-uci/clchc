import React, { useState } from "react";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import {
  useDeleteUserByFirebaseUid,
  useUpdateUserByFirebaseUid,
} from "@/contexts/hooks/data-fetching/useUsers.js";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";

import StepFinalize from "./transfer-master/StepFinalize.jsx";
import StepReviewTransfer from "./transfer-master/StepReviewTransfer.jsx";
import StepSelectUser from "./transfer-master/StepSelectUser.jsx";
import TransferModalHeader from "./transfer-master/TransferModalHeader.jsx";

export default function TransferMasterRoleModal({ isOpen, onClose }) {
  const { currentUser, logout } = useAuthContext();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [option, setOption] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { mutateAsync: deleteUser } = useDeleteUserByFirebaseUid();
  const { mutateAsync: updateUser } = useUpdateUserByFirebaseUid();

  const update = async () => {
    if (!selectedUser) {
      throw new Error("No user selected for transfer");
    }

    if (option === "delete") {
      try {
        await updateUser({ uid: selectedUser, data: { role: "master" } });
      } catch (error) {
        console.error("Error transferring master role:", error);
        throw error;
      }
      try {
        await deleteUser(currentUser.uid);
        logout();
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    } else if (option === "ccm") {
      try {
        await updateUser({ uid: selectedUser, data: { role: "master" } });
      } catch (error) {
        console.error("Error transferring master role:", error);
        throw error;
      }
      try {
        await updateUser({ uid: currentUser.uid, data: { role: "ccm" } });
      } catch (error) {
        console.error("Error downgrading own role:", error);
        throw error;
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
          try {
            await update();
            onClose();
            setStep(1);
            window.location.reload();
          } catch (error) {
            console.error("Error finalizing transfer flow:", error);
            toast({
              title: "Transfer failed",
              description:
                "We couldn't complete the role transfer.",
              status: "error",
              duration: 7000,
              isClosable: true,
              position: "top",
            });
          }
        }}
      />
    ),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      //   size="full"
    >
      <ModalOverlay />
      <ModalContent
        padding="0.75em"
        minW="700px"
        h="565px"
        borderRadius="22px"
      >
        <TransferModalHeader step={step} />
        <ModalBody h="100%">{stepMap[step]}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
