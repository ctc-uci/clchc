import React, { useState } from "react";

import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import StepFinalize from "./transfer-master/StepFinalize.jsx";
import StepReviewTransfer from "./transfer-master/StepReviewTransfer.jsx";
import StepSelectUser from "./transfer-master/StepSelectUser.jsx";
import TransferModalHeader from "./transfer-master/TransferModalHeader.jsx";

export default function TransferMasterRoleModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

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
        selected={selectedUser}
        onNext={() => setStep(3)}
      />
    ),
    3: (
      <StepFinalize
        onClose={() => {
          onClose();
          setStep(1);
        }}
        selected={selectedUser}
        onFinalize={() => {
          update();
          onClose();
          setStep(1);
        }}
      />
    ),
  };

  const update = () => {
    console.log("update master role");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <TransferModalHeader step={step} />
        <ModalBody>{stepMap[step]}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
