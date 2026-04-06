import React, { useEffect, useState } from "react";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  Input,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useUpdateUser } from "@/contexts/hooks/data-fetching/useUsers";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { MdEdit } from "react-icons/md";

import ConfirmationModal from "./ConfirmationModal";

const ROLE_LABELS = {
    viewer: "Viewer",
    ccm: "CCM",
    ccs: "CCS",
    master: "Master",
  };

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
    if (!dbUser?.id) return false;

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
      return true;
    } catch (_error) {
      return false;
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
        name={`${userInfo?.firstName} ${userInfo?.lastName}`}
        size="sm"
        bg="#FFF"
        color="black"
        borderRadius="10px"
        w="36px"
        h="36px"
        fontSize="14px"
      />

      <Box flex={1}>
        <Text
          fontWeight="600"
          fontSize="14px"
        >
          {userInfo?.firstName} {userInfo?.lastName}
        </Text>
        <Text
          fontSize="12px"
          color="gray.500"
        >
          {userInfo?.email}
        </Text>
      </Box>

      <Tag
        border="1px solid #D1D5DB"
        borderRadius="8px"
        px={2}
        py="2px"
        fontSize="12px"
        bg="#F5F5F5"
      >
        {ROLE_LABELS[userInfo?.role] || userInfo?.role}
      </Tag>
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
                  value={
                    key === "role"
                      ? ROLE_LABELS[userInfo[key]] || userInfo[key]
                      : userInfo[key]
                  }
                  onChange={(e) => updateUserProp(key, e.target.value)}
                  isReadOnly={!isEditMode}
                  bg={isEditMode ? "white" : "gray.100"}
                  color={isEditMode ? "black" : "#586771"}
                  border={isEditMode ? "1px solid" : "none"}
                  borderColor={isEditMode ? "blue.400" : "transparent"}
                  transition="all 0.15s"
                  width="275px"
                />
                {editable && (
                  <IconButton
                    icon={
                      isEditMode ? (
                        <CheckIcon boxSize={3.5} />
                      ) : (
                        <Icon
                          as={MdEdit}
                          boxSize={4}
                        />
                      )
                    }
                    size="sm"
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
