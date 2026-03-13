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

  const { mutate: updateQuota } = useUpdateQuota();
  const { mutate: createLog } = useCreateLog();
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

  // batch flush
  const flushQueue = async () => {
    const queue = [...deltaQueueRef.current];
    if (queue.length === 0) return;

    // drain immediately so re-entrant flushes are no-ops
    deltaQueueRef.current = [];

    const baseline = confirmedRef.current ?? quotaRef.current?.progress ?? 0;
    const netDelta = queue.reduce((sum, d) => sum + d, 0);
    const nextValue = clamp(baseline + netDelta);

    try {
      // 1. Write every delta as its own version-log row inside a single
      //    backend transaction (the server rolls everything back on failure).
      //    2. Apply the net change to the quota in one update.
      //    The server is expected to do both atomically.
      await updateQuota({
        id: quotaRef.current.id,
        data: {
          progress: nextValue,
          deltas: queue, // server opens txn, logs each, then updates
        },
      });

      // Persist a log entry per delta (if your API handles it per-delta here)
      for (const delta of queue) {
        console.log("Creating log for delta:", delta);
        await createLog({
          userId: dbUser?.id,
          quotaId: quotaRef.current.id,
          action: delta > 0 ? "increment" : "decrement",
          delta,
        });
      }

      // server confirmed the new value
      confirmedRef.current = nextValue;
    } catch (err) {
      console.error("Batch quota update failed — rolling back:", err);

      // rollback: snap ui back to last confirmed value
      const rollbackTo = confirmedRef.current ?? baseline;
      setCurrentProgress(rollbackTo);

      toast({
        title: "Update failed",
        description:
          "Your changes couldn't be saved. Progress has been restored.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  // 500 ms quiet period after the last click before we hit the server
  const debouncedFlush = useDebounce(flushQueue, 500);

  useEffect(() => {
    return () => {
      debouncedFlush.cancel();
      flushQueue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (delta) => {
    setCurrentProgress((prev) => {
      const next = clamp(prev + delta);
      if (next === prev) return prev; // already at boundary, no-op
      return next;
    });
    deltaQueueRef.current.push(delta);
    debouncedFlush(); // reset the 500 ms countdown
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
