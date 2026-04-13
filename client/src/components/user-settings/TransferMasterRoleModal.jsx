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
  const [option, setOption] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const update = () => {
    console.log("update master role");
    if (option === "delete") {
        console.log("delete account");
        console.log("transfer master role to ", selectedUser);
    }
    else {
        console.log("make current master ccm");
        console.log("transfer master role to ", selectedUser);
    }
  }

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
        onFinalize={() => {
          update();
          onClose();
          setStep(1);
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
      <ModalContent padding="1em" minW="700px" minH="500px">
        <TransferModalHeader step={step} />
        <ModalBody>{stepMap[step]}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
