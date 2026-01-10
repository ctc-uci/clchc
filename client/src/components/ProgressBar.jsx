import React, { useRef, useEffect } from "react";
import { Button, Flex, Progress, Icon, } from "@chakra-ui/react";
import {ArrowUp, ArrowDown} from "lucide-react";
import { useBackendContext } from "../contexts/hooks/useBackendContext";

export default function ProgressBar({currentProgress, setCurrentProgress, quotaID}) {
  
  // Since Playground.jsx is currently an unprotected route, there's no login so
  // we can't use the auth context => the API connection does not pass
  // I think we would have to put this component in a
  // temporary protected route for testing purposes it?
  // But for now, this seems like it might work.
  const {backend} = useBackendContext();
  const quotaRef = useRef();
  //const [quota, setQuota] = useState();
  useEffect(() => {
    (async () => {
      const { data } = await backend.get(`/quota/${quotaID}`);
      console.log(data);
      quotaRef.current = data;
      setQuota(data);
    })();
  }, []);

  const updateProgress = async (progress) => {
    if (!quotaRef.current) return;
    await backend.put(`/quota/${quotaID}`, {
      ...quotaRef.current,
      progress
    });
  }
  
  // Updating backend and frontend
  const handleDecrease = async () => {
    await updateProgress(currentProgress- 1);
    setCurrentProgress((prev) => prev - 1);
  }

  const handleIncrease = async () => {
    await updateProgress(currentProgress+ 1);
    setCurrentProgress((prev) => prev + 1);
  }
  
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
        max="12"
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
