import React, { useEffect, useRef, useState } from "react";

import {
  Button,
  Flex,
  Icon,
  Progress,
  Text,
} from "@chakra-ui/react";

import {
  useUpdateQuota,
} from "@/contexts/hooks/data-fetching/useQuotas";
import { useCreateLog } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function ProgressBar({ quota }) {
  const quotaRef = useRef(null);
  // const [quota, setQuota] = useState(null);
  const { mutate: updateQuota } = useUpdateQuota();
  const { mutate: createLog } = useCreateLog();
  const maxProgress = quota?.quota ?? 0;
  const current = quota?.progress ?? 0;
  const [currentProgress, setCurrentProgress] = useState(current);
  const [originalProgress, setOriginalProgress] = useState(null);
  const { dbUser } = useUserContext();

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
      await updateQuota({ id: quota.id, data: { progress: next } });
    } catch (err) {
      console.error("Error updating progress:", err);
    }

    try {
      await createLog({
        userId: dbUser?.id,
        quotaId: quota.id,
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

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Flex
        alignItems="center"
        gap="6px"
        flex="1"
        maxWidth="calc(100% - 39px)"
      >
        <Button
          onClick={handleDecrease}
          isDisabled={currentProgress <= 0}
          minW="24px"
          height="33px"
          padding="0"
          borderRadius="4px"
          bg="black"
          flexShrink={0}
        >
          <Icon
            color="white"
            boxSize={4}
          >
            <ArrowDown />
          </Icon>
        </Button>

        <Progress
          value={currentProgress}
          max={maxProgress}
          flex="1"
          width="141px"
          height="12px"
          borderRadius="4px"
          background="rgba(0, 0, 0, 0.06)"
          marginx="6px"
          sx={{
            "& > div": {
              backgroundColor: "#38A169",
            },
          }}
        />

        <Button
          onClick={handleIncrease}
          isDisabled={currentProgress >= maxProgress}
          minW="24px"
          height="33px"
          padding="0"
          borderRadius="4px"
          bg="black"
          flexShrink={0}
        >
          <Icon
            color="white"
            boxSize={4}
          >
            <ArrowUp />
          </Icon>
        </Button>
      </Flex>
      <Text
        color="black"
        fontSize="16px"
        fontWeight="600"
        lineHeight="24px"
        flexShrink={0}
        marginLeft="6px"
        minWidth="40px"
      >
        {currentProgress}/{maxProgress}
      </Text>
    </Flex>
  );
}
