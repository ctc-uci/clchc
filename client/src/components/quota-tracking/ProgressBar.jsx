import React, { useEffect, useRef, useState } from "react";

import { Button, Flex, Icon, Progress, Text, useToast } from "@chakra-ui/react";

import { useUpdateQuota } from "@/contexts/hooks/data-fetching/useQuotas";
import { useCreateLog } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function ProgressBar({ quota }) {
  const quotaRef = useRef(null);
  const deltaQueueRef = useRef([]); // buffers +1 / -1 clicks
  const confirmedRef = useRef(null); // last server-confirmed value

  const { mutateAsync: updateQuota } = useUpdateQuota();
  const { mutateAsync: createLog } = useCreateLog();
  const { dbUser } = useUserContext();
  const toast = useToast();

  const maxProgress = quota?.quota ?? 0;
  const serverValue = quota?.progress ?? 0;

  const [currentProgress, setCurrentProgress] = useState(serverValue);

  useEffect(() => {
    if (!quota) return;
    quotaRef.current = quota;

    if (deltaQueueRef.current.length === 0) {
      setCurrentProgress(quota.progress ?? 0);
      confirmedRef.current = quota.progress ?? 0;
    }
  }, [quota]);

  const clamp = (n) => Math.max(0, Math.min(n, maxProgress));

  const rollback = () => {
    const baseline = confirmedRef.current ?? quotaRef.current?.progress ?? 0;
    setCurrentProgress(baseline);
    toast({
      title: "Update failed",
      description:
        "Your changes couldn't be saved. Progress has been restored.",
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const flushQueue = async () => {
    const queue = [...deltaQueueRef.current];
    if (queue.length === 0) return;

    deltaQueueRef.current = [];

    const baseline = confirmedRef.current ?? quotaRef.current?.progress ?? 0;
    const netDelta = queue.reduce((sum, d) => sum + d, 0);
    const nextValue = clamp(baseline + netDelta);

    try {
      await updateQuota({
        id: quotaRef.current.id,
        data: {
          progress: nextValue,
          deltas: queue,
        },
      });

      for (const delta of queue) {
        await createLog({
          userId: dbUser?.id,
          quotaId: quotaRef.current.id,
          action: delta > 0 ? "increment" : "decrement",
          delta,
        });
      }

      confirmedRef.current = nextValue;
    } catch (err) {
      console.error("Batch quota update failed — rolling back:", err);
      rollback();
    }
  };

  const debouncedFlush = useDebounce(flushQueue, 500);

  useEffect(() => {
    return () => {
      debouncedFlush.cancel();
      flushQueue();
    };
  }, []);

  const handleClick = (delta) => {
    setCurrentProgress((prev) => {
      const next = clamp(prev + delta);
      if (next === prev) return prev;
      return next;
    });
    deltaQueueRef.current.push(delta);
    debouncedFlush();
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
          onClick={() => handleClick(-1)}
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
          background="rgba(0,0,0,0.06)"
          marginx="6px"
          sx={{ "& > div": { backgroundColor: "#38A169" } }}
        />

        <Button
          onClick={() => handleClick(+1)}
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

      <Flex
        direction="column"
        alignItems="flex-end"
        marginLeft="6px"
        flexShrink={0}
      >
        <Text
          color="black"
          fontSize="16px"
          fontWeight="600"
          lineHeight="24px"
          minWidth="40px"
        >
          {currentProgress}/{maxProgress}
        </Text>
      </Flex>
    </Flex>
  );
}
