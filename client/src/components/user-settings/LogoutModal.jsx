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
import { useAuthContext } from "@/contexts/hooks/useAuthContext";

export default function LogoutModal({ isOpen, onClose }) {
  const { role } = useRoleContext();
  const { logout } = useAuthContext();
  const [userInfo] = useState();
  const handleLogout = () => logout();

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
