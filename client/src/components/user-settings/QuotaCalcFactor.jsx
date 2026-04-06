import React, { useEffect, useState } from "react";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useUpdateUser } from "@/contexts/hooks/data-fetching/useUsers";
import { useUserContext } from "@/contexts/hooks/useUserContext";

import ConfirmationModal from "./ConfirmationModal";

export default function QuotaCalcFactor() {
  const userData = useUserContext();
  const { mutateAsync: updateUser } = useUpdateUser();
  const dbUser = userData?.dbUser;
  const refetch = userData?.refetch;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [factor, setFactor] = useState(dbUser?.apptCalcFactor?.toString() || "");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setFactor(dbUser?.apptCalcFactor?.toString() || "");
  }, [dbUser, setFactor]);

  const handleSave = async () => {
  if (!dbUser?.id) return false;

  const numericFactor = factor === "" ? 0 : parseFloat(factor);

  if (isNaN(numericFactor)) return false;

  try {
    await updateUser({
      id: dbUser.id,
      data: { apptCalcFactor: numericFactor },
    });
    await refetch();
    setIsEditMode(false);
    return true;
  } catch (_error) {
    return false;
  }
};

  const handleToggle = () => {
    if (isEditMode) {
      onOpen();
    } else {
      setIsEditMode(true);
    }
  };

  const modalPreview = (
    <Flex
      align="center"
      justify="space-between"
    >
      <Text fontSize="sm">Quota Calculation Factor</Text>
      <Box
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        px={2}
        py={0.5}
      >
        <Text fontSize="sm">{factor || "0"}</Text>
      </Box>
    </Flex>
  );

  return (
    <>
      <FormControl maxW="300px">
        <FormLabel
          fontWeight="semibold"
          fontSize="sm"
        >
          Calculation Factor
        </FormLabel>
        <Flex
          align="center"
          gap={2}
        >
          <Input
            type="number"
            value={factor}
            onChange={(e) => setFactor(e.target.value)}
            isReadOnly={!isEditMode}
            bg={isEditMode ? "white" : "gray.100"}
            color={isEditMode ? "black" : "#586771"}
            border={isEditMode ? "1px solid" : "none"}
            borderColor={isEditMode ? "blue.400" : "transparent"}
            transition="all 0.15s"
          />
          <IconButton
            icon={isEditMode ? <CheckIcon /> : <EditIcon />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            aria-label={
              isEditMode ? "Save Calculation Factor" : "Edit Calculation Factor"
            }
            onClick={handleToggle}
            flexShrink={0}
          />
        </Flex>
      </FormControl>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSave}
        preview={modalPreview}
      />
    </>
  );
}
