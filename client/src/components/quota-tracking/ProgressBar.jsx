import React, { useEffect, useRef, useState } from "react";

import { Button, Flex, Icon, Progress, Text } from "@chakra-ui/react";

import { ArrowDown, ArrowUp } from "lucide-react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export default function ProgressBar({ quotaID }) {
  const { backend } = useBackendContext();

  const quotaRef = useRef(null);
  const [quota, setQuota] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  //populate quota on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await backend.get(`/quota/${quotaID}`);
        const q = data?.[0];

        if (!q) return;

        quotaRef.current = q;
        setQuota(q);
        setCurrentProgress(q.progress ?? 0);
      } catch (err) {
        console.error("Error fetching quota:", err);
      }
    })();
  }, [backend, quotaID]);

  const maxProgress = quota?.quota ?? 0;

  //update progress in DB
  const updateProgress = async (next) => {
    if (!quotaRef.current) return;
    try {
      await backend.put(`/quota/${quotaID}`, {
        ...quotaRef.current,
        progress: next,
      });

      quotaRef.current = { ...quotaRef.current, progress: next };
    } catch (err) {
      console.error("Error updating progress:", err);
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
