import React from "react";

import { Button, Flex, Progress } from "@chakra-ui/react";

export default function ProgressBar(props) {
  const { width = "172px", currentProgress, setCurrentProgress } = props;

  const handleDecrease = () => setCurrentProgress((prev) => prev - 1);

  const handleIncrease = () => setCurrentProgress((prev) => prev + 1);

  return (
    <Flex
      alignItems="center"
      gap="5px"
      padding={1}
    >
      <Button
        onClick={handleDecrease}
        width="17px"
        minW={0}
        px={0}
        height="22px"
        border="1px black solid"
        background="white"
        border-radius="5px"
        fontSize="100%"
      >
        {"\u2193"}
      </Button>
      <Progress
        value={currentProgress}
        max="12"
        colorScheme="gray"
        width={width}
        borderRadius={6}
        border="1px lightgray solid"
        background="gray.50"
      />
      <Button
        onClick={handleIncrease}
        width="17px"
        minW={0}
        px={0}
        height="22px"
        border="1px black solid"
        background="black"
        textColor="white"
        _hover={{ background: "gray" }}
        fontSize="100%"
      >
        {"\u2191"}
      </Button>
    </Flex>
  );
}
