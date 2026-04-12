import React, { useState } from "react";

import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import StepFinalize from "./transfer-steps/StepFinalize.jsx";
import StepReviewTransfer from "./transfer-steps/StepReviewTransfer.jsx";
import StepSelectUser from "./transfer-steps/StepSelectUser.jsx";

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
        <ModalHeader>
          <HStack>
            <Box
              w="40px"
              h="40px"
              bg={step === 1 ? "#113D64" : "gray"}
              borderRadius="10000"
            >
              {" "}
              <Text> 1 </Text>{" "}
            </Box>{" "}
            <Text>Select User</Text>
            <Box
              w="40px"
              h="40px"
              bg={step === 2 ? "#113D64" : "gray"}
              borderRadius="10000"
            >
              {" "}
              <Text> 2 </Text>{" "}
            </Box>{" "}
            <Text>Review</Text>
            <Box
              w="40px"
              h="40px"
              bg={step === 3 ? "#113D64" : "gray"}
              borderRadius="10000"
            >
              {" "}
              <Text> 3 </Text>{" "}
            </Box>{" "}
            <Text>Finalize</Text>
          </HStack>
        </ModalHeader>
        <ModalBody>{stepMap[step]}</ModalBody>
      </ModalContent>
      <ModalFooter>
        <Button onClick={onClose}>
          <Text>Cancel</Text>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
