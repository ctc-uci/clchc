import React, { useEffect, useState } from "react";

import {
  Button,
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { useNavigate } from "react-router-dom";

import { Login } from "/src/components/login/Login.tsx";

export default function LogoutModal({ isOpen, onClose }) {
  const { role } = useRoleContext();
  const [userInfo] = useState();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <Grid placeItems="center">
          <ModalHeader fontSize="3xl">Logout</ModalHeader>
          <ModalBody fontSize="1.25em">
            Are you sure you want to log out of {role}?
          </ModalBody>
          <ModalFooter>
            <HStack gap="1.5em">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleLogout}
                backgroundColor="#bbb"
              >
                Logout
              </Button>
            </HStack>
          </ModalFooter>
        </Grid>
      </ModalContent>
    </Modal>
  );
}
