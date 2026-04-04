import React, { useEffect, useState } from "react";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useUpdateUser } from "@/contexts/hooks/data-fetching/useUsers";
import { useUserContext } from "@/contexts/hooks/useUserContext";

import ConfirmationModal from "./ConfirmationModal";

export default function PersonalInfo() {
  const userData = useUserContext();
  const { mutateAsync: update } = useUpdateUser();
  const dbUser = userData?.dbUser;
  const refetch = userData?.refetch;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pendingKey, setPendingKey] = useState(null);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [editing, setEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
    role: false,
  });

  useEffect(() => {
    if (dbUser) {
      setUserInfo({
        firstName: dbUser.firstName ?? "",
        lastName: dbUser.lastName ?? "",
        email: dbUser.email ?? "",
        role: dbUser.role ?? "",
      });
    }
  }, [dbUser]);

  if (!dbUser) return null;

  const updateUserProp = (key, value) =>
    setUserInfo((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      await update({
        id: dbUser.id,
        data: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
        },
      });
      await refetch();
      setEditing((prev) => ({ ...prev, [pendingKey]: false }));
    } catch (e) {
      console.error("Failed to update user:", e);
    }
  };

  const toggleEdit = (key) => {
    if (editing[key]) {
      setPendingKey(key);
      onOpen();
    } else {
      setEditing((prev) => ({ ...prev, [key]: true }));
    }
  };

  const fields = [
    { label: "First Name", key: "firstName", editable: true },
    { label: "Last Name", key: "lastName", editable: true },
    { label: "Email Address", key: "email", editable: false },
    { label: "Role", key: "role", editable: false },
  ];

  const modalPreview = (
    <Flex
      align="center"
      gap={3}
    >
      <Avatar
        name={`${userInfo.firstName} ${userInfo.lastName}`}
        size="sm"
        bg="gray.300"
        color="gray.700"
      />
      <Box flex={1}>
        <Text
          fontWeight="semibold"
          fontSize="sm"
        >
          {userInfo.firstName} {userInfo.lastName}
        </Text>
        <Text
          fontSize="xs"
          color="gray.500"
        >
          {userInfo.email}
        </Text>
      </Box>
      <Box
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        px={2}
        py={0.5}
      >
        <Text fontSize="sm">{userInfo.role}</Text>
      </Box>
    </Flex>
  );

  return (
    <>
      <Grid
        templateColumns="1fr 1fr"
        gap="1em"
      >
        {fields.map(({ label, key, editable }) => {
          const isEditMode = editing[key];
          return (
            <FormControl key={key}>
              <FormLabel
                fontWeight="semibold"
                fontSize="sm"
              >
                {label}
              </FormLabel>
              <Flex
                align="center"
                gap={2}
              >
                <Input
                  value={userInfo[key]}
                  onChange={(e) => updateUserProp(key, e.target.value)}
                  isReadOnly={!isEditMode}
                  bg={isEditMode ? "white" : "gray.100"}
                  border={isEditMode ? "1px solid" : "none"}
                  borderColor={isEditMode ? "blue.400" : "transparent"}
                  transition="all 0.15s"
                  width="275px"
                />
                {editable && (
                  <IconButton
                    icon={isEditMode ? <CheckIcon /> : <EditIcon />}
                    size="s"
                    variant="ghost"
                    colorScheme="gray"
                    aria-label={isEditMode ? `Save ${label}` : `Edit ${label}`}
                    onClick={() => toggleEdit(key)}
                    flexShrink={0}
                  />
                )}
              </Flex>
            </FormControl>
          );
        })}
      </Grid>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSave}
        preview={modalPreview}
      />
    </>
  );
}
