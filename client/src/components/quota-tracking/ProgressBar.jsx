import React, { useEffect, useRef, useState } from "react";

import { Button, Flex, Icon, Progress, Text } from "@chakra-ui/react";

import { BackendContext } from "@/contexts/BackendContext";
import {
  useQuotaById,
  useUpdateQuota,
} from "@/contexts/hooks/data-fetching/useQuotas";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { ArrowDown, ArrowUp } from "lucide-react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export default function ProgressBar({ quotaID }) {
  const quotaRef = useRef(null);
  // const [quota, setQuota] = useState(null);
  const {
    mutate: updateQuota,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateQuota();
  const { data: quota, isLoading, error, refetch } = useQuotaById(quotaID);
  const maxProgress = quota?.quota ?? 0;
  const current = quota?.progress ?? 0;
  const [currentProgress, setCurrentProgress] = useState(current);
  const [originalProgress, setOriginalProgress] = useState(null);
  const { dbUser } = useUserContext();
  const { backend } = useBackendContext();

  useEffect(() => {
    if (quota) {
      quotaRef.current = quota;
      setCurrentProgress(quota.progress ?? 0);
      setOriginalProgress(quota.progress ?? 0);
    }
  }, [quota]);

  //update progress in DB
  const updateProgress = async (next) => {
    const currentQuota = quota ?? quotaRef.current;
    if (!currentQuota) return;

    try {
      await updateQuota({ id: quotaID, data: { progress: next } });
    } catch (err) {
      console.error("Error updating progress:", err);
    }

    try {
      await backend.post("/versionLog", {
        userId: dbUser?.id,
        quotaId: quotaID,
        action: next > originalProgress ? "increment" : "decrement",
        delta: next - originalProgress,
      });
      setOriginalProgress(next);
    } catch (err) {
      console.error("Error logging quota change to version log:", err);
    }
  };

  const clamp = (n) => Math.max(0, Math.min(n, maxProgress));

  //handlers for buttons
  const handleDecrease = async () => {
    const next = clamp(currentProgress - 1);
    if (next === currentProgress) return;
    setCurrentProgress(next);
    await updateProgress(next);
  };

  const handleIncrease = async () => {
    const next = clamp(currentProgress + 1);
    if (next === currentProgress) return;
    setCurrentProgress(next);
    await updateProgress(next);
  };

  if (isLoading) return <Text>Loading quota...</Text>;
  if (error) return <Text>Error loading quota: {error.message}</Text>;
  return (
    <Flex
      alignItems="center"
      gap="5px"
      padding={1}
    >
      <Button
        onClick={handleDecrease}
        isDisabled={currentProgress <= 0}
        width="20px"
        minW={0}
        px={0}
        height="24px"
        border="1px black solid"
        background="white"
        borderRadius="5px"
        fontSize="100%"
      >
        <Icon>
          <ArrowDown />
        </Icon>
      </Button>
      <Progress
        value={currentProgress}
        max={maxProgress}
        colorScheme="gray"
        width="172px"
        borderRadius={6}
        border="1px lightgray solid"
        background="gray.50"
      />
      <Button
        onClick={handleIncrease}
        isDisabled={currentProgress >= maxProgress}
        width="20px"
        minW={0}
        px={0}
        height="24px"
        border="1px black solid"
        background="black"
        textColor="white"
        _hover={{ background: "gray" }}
        fontSize="100%"
      >
        <Icon>
          <ArrowUp />
        </Icon>
      </Button>
      <Text>
        {currentProgress}/{maxProgress}
      </Text>
    </Flex>
  );
}
