import { Avatar, Box, Grid, GridItem, Text } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";

import PersonalInfo from "./PersonalInfo.jsx";
import QuotaCalcFactor from "./QuotaCalcFactor.jsx";
import SignOutSection from "./SignOutSection.jsx";
import TransferMasterRole from "./TransferMasterRole.jsx";

export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const CALCULATION_FACTOR = "calculation-factor";

export function Settings() {
  const userData = useUserContext();
  const dbUser = userData?.dbUser;
  const { currentUser } = useAuthContext();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      pt="40px"
      px="40px"
      backgroundColor="#F9F9F9"
    >
      <Grid
        templateColumns="300px 1fr 1fr"
        maxW="1400px"
        // templateRows="auto auto auto"
        mx="auto"
        minH="520px"
        backgroundColor="#F9F9F9"
      >
        <GridItem
          rowSpan={dbUser?.role === "master" || dbUser?.role === "ccm" ? 3 : 2}
          p="2em"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          pt="3em"
          gap="1em"
          width="300px"
        >
          <Avatar
            w="280px"
            h="280px"
            name={`${dbUser?.firstName} ${dbUser?.lastName}`}
            src={currentUser?.photoURL}
            css={{
              imageRendering: "-webkit-optimize-contrast",
            }}
          />
          <Text
            fontWeight="bold"
            fontSize="32px"
            textAlign="center"
            paddingTop="50px"
          >
            {dbUser?.firstName} {dbUser?.lastName}
          </Text>
          <Text
            fontWeight="semibold"
            fontSize="24px"
            textAlign="center"
            paddingTop="15px"
          >
            {dbUser?.email}
          </Text>
        </GridItem>

        <GridItem
          p="1.5em"
          borderColor="gray.200"
          ml="80px"
        >
          <Text
            fontWeight="bold"
            fontSize="22px"
          >
            Personal Information
          </Text>
          <Text
            fontSize="14px"
            color="gray.600"
            mt="0.5em"
          >
            Edit your personal information here.
          </Text>
        </GridItem>
        <GridItem
          p="1em"
          ml="45px"
          borderColor="gray.200"
          marginBottom="30px"
        >
          <PersonalInfo />
        </GridItem>

        {dbUser?.role === "master" || dbUser?.role === "ccm" ? (
          <>
            <GridItem
              p="1em"
              borderColor="gray.200"
              ml="80px"
              marginBottom="30px"
            >
              <Text
                fontWeight="bold"
                fontSize="22px"
              >
                Quota Calculation Factor
              </Text>
              <Text
                fontSize="14px"
                color="gray.600"
                mt="0.5em"
              >
                This value is used to automatically calculate appointment quotas
                when creating new schedules.
              </Text>
            </GridItem>
            <GridItem
              p="1em"
              ml="45px"
              borderColor="gray.200"
            >
              <QuotaCalcFactor />
            </GridItem>
          </>
        ) : (
          <></>
        )}

        <GridItem
          p="1em"
          ml="80px"
          marginBottom="30px"
        >
          <Text
            fontWeight="bold"
            fontSize="22px"
          >
            Sign Out
          </Text>
          <Text
            fontSize="14px"
            color="gray.600"
            mt="12px"
          >
            Sign out of your account.
          </Text>
        </GridItem>
        <GridItem
          p="1em"
          ml="45px"
        >
          <SignOutSection />
        </GridItem>
        {dbUser?.role === "master" ? (
          <>
            <GridItem>{/* Transfer Master Role Grid Item */}</GridItem>
            <GridItem
              p="1em"
              ml="80px"
              colSpan={2}
            >
              <TransferMasterRole />
            </GridItem>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Box>
  );
}
