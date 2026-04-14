import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  Skeleton,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useUserByFirebaseUid } from "@/contexts/hooks/data-fetching/useUsers";
import { useUserContext } from "@/contexts/hooks/useUserContext";

const ROLE_LABELS = {
  viewer: "Viewer",
  ccm: "CCM",
  ccs: "CCS",
  master: "Master",
};

const ROLE_COLORS = {
  ccm: "#07B8AC",
  ccs: "#35639D",
  master: "#573D59",
};

function UserCard({ user, roleBg, roleLabel }) {
  return (
    <Box
      bg="#F7F7F7"
      border="1px solid #E5E5E5"
      borderRadius="8px"
      px={4}
      py={3}
      w="100%"
    >
      <Flex
        align="center"
        gap={3}
      >
        <Avatar
          name={`${user?.firstName} ${user?.lastName}`}
          src={user?.photoURL}
          size="sm"
          bg="#FFF"
          color="black"
          borderRadius="10px"
          w="36px"
          h="36px"
          fontSize="14px"
        />

        <Box flex={1}>
          <Text
            fontWeight="600"
            fontSize="14px"
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text
            fontSize="12px"
            color="gray.500"
          >
            {user?.email}
          </Text>
        </Box>

        <Tag
          border="1px solid #D1D5DB"
          borderRadius="6px"
          px={2}
          py="2px"
          fontSize="12px"
          color="white"
          bg={roleBg || "#F5F5F5"}
        >
          {roleLabel}
        </Tag>
      </Flex>
    </Box>
  );
}

export default function StepReviewTransfer({ onClose, selectedUid, onNext }) {
  const userData = useUserContext();
  const dbUser = userData?.dbUser;
  const [input, setInput] = useState("");
  const isTransferEnabled = input === "TRANSFER";
  const { data: selected, isLoading } = useUserByFirebaseUid(selectedUid);
  const selectedUser = selected?.[0];

  return (
    <>
      <VStack alignItems="flex-start">
        <Text
          fontSize="14px"
          fontWeight="400"
        >
          Step 2: Review Transfer
        </Text>
        <Text
          fontSize="14px"
          fontWeight="400"
          color="gray.600"
        >
          Confirm the details of this role transfer.
        </Text>
        {isLoading ? (
          <>
            <Skeleton
              height="57px"
              width="100%"
            />
            <Skeleton
              height="56px"
              width="100%"
            />
            <Skeleton
              height="57px"
              width="100%"
            />{" "}
          </>
        ) : (
          <Grid
            templateColumns="1fr 1fr"
            columnGap="20px"
            rowGap="5px"
            w="100%"
            mx="auto"
          >
            <GridItem>
              <UserCard
                user={dbUser}
                roleBg={ROLE_COLORS[dbUser?.role]}
                roleLabel={ROLE_LABELS[dbUser?.role] || dbUser?.role}
              />
            </GridItem>
            <GridItem>
              <UserCard
                user={selectedUser}
                roleBg={ROLE_COLORS[selectedUser?.role]}
                roleLabel={ROLE_LABELS[selectedUser?.role] || selectedUser?.role}
              />
            </GridItem>
            <GridItem>
              <VStack gap="0px">
                <ChevronUpIcon
                  padding="0"
                  margin="0"
                  boxSize={6}
                  color="black"
                />
                <ChevronDownIcon
                  padding="0"
                  margin="0"
                  boxSize={6}
                  color="black"
                />
              </VStack>
            </GridItem>
            <GridItem>
              <VStack gap="0px">
                <ChevronUpIcon
                  boxSize={6}
                  color="black"
                />
                <ChevronDownIcon
                  boxSize={6}
                  color="black"
                />
              </VStack>
            </GridItem>
            <GridItem>
              <UserCard
                user={dbUser}
                roleBg={ROLE_COLORS[selectedUser?.role]}
                roleLabel={ROLE_LABELS[selectedUser?.role] || selectedUser?.role}
              />
            </GridItem>
            <GridItem>
              <UserCard
                user={selectedUser}
                roleBg={ROLE_COLORS[dbUser?.role]}
                roleLabel={ROLE_LABELS[dbUser?.role] || dbUser?.role}
              />
            </GridItem>
          </Grid>
        )}

        <Text
          fontSize="14px"
          fontWeight="400"
          mt="30px"
        >
          Type 'TRANSFER' to continue{" "}
        </Text>
        <Input
          value={input}
          placeholder="type 'TRANSFER'"
          onChange={(e) => setInput(e.target.value)}
        ></Input>
      </VStack>
      <HStack
        justifyContent="flex-end"
        gap="10px"
        mt="30px"
      >
        <Button
          onClick={onClose}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="white"
          border="0.5px solid #D9D9D9"
        >
          Cancel
        </Button>
        <Button
          onClick={onNext}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="#113D64"
          color="white"
          border="0.5px solid #D9D9D9"
          isDisabled={!isTransferEnabled}
        >
          Next
        </Button>
      </HStack>
    </>
  );
}
