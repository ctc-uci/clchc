import { Box, InputRightElement, Skeleton } from "@chakra-ui/react";

import { LockKeyhole } from "lucide-react";

export const SkeletonBody = () => {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton
          key={i}
          height="15%"
          margin="20px"
        />
      ))}
    </>
  );
};

export const LockRightElement = (props) => (
  <InputRightElement
    pointerEvents="none"
    color="gray.400"
    h="100%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    {...props}
  >
    <Box
      as={LockKeyhole}
      w="clamp(12px, 40%, 16px)"
      h="clamp(12px, 40%, 16px)"
    />
  </InputRightElement>
);
