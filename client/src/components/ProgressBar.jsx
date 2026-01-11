import React, { useEffect, useRef, useState } from "react";

import { Button, Flex, Icon, Progress, Text } from "@chakra-ui/react";

import { ArrowDown, ArrowUp } from "lucide-react";

import { useBackendContext } from "../contexts/hooks/useBackendContext";

export default function ProgressBar({
  currentProgress,
  setCurrentProgress,
  quotaID,
}) {
  const { backend } = useBackendContext();
  const quotaRef = useRef();
  const [quota, setQuota] = useState();

  //populate quota on mount
  useEffect(() => {
    (async () => {
      const { data } = await backend.get(`/quota/${quotaID}`);
      quotaRef.current = data[0];
      setQuota(data[0]);
    })();
  }, []);

  //update progress in DB
  const updateProgress = async (progress) => {
    if (!quotaRef.current) return;
    await backend.put(`/quota/${quotaID}`, {
      ...quotaRef.current,
      progress,
    });
  };

  //handlers for buttons
  const handleDecrease = async () => {
    await updateProgress(currentProgress - 1);
    setCurrentProgress((prev) => prev - 1);
  };

  const handleIncrease = async () => {
    await updateProgress(currentProgress + 1);
    setCurrentProgress((prev) => prev + 1);
  };

  return (
    <Flex
      alignItems="center"
      gap="5px"
      padding={1}
    >
      <Button
        onClick={handleDecrease}
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
        max={quota ? quota.quota : 10}
        colorScheme="gray"
        width="172px"
        borderRadius={6}
        border="1px lightgray solid"
        background="gray.50"
      />
      <Button
        onClick={handleIncrease}
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
    </Flex>
  );
}
