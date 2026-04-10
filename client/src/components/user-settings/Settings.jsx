import { Avatar, Box, Grid, GridItem, Text } from "@chakra-ui/react";



import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";


import PersonalInfo from "./PersonalInfo.jsx";
import QuotaCalcFactor from "./QuotaCalcFactor.jsx";
import SignOutSection from "./SignOutSection.jsx";


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
      py="80px"
    >
      <Grid
        templateColumns="300px 1fr 1fr"
        maxW="1400px"
        templateRows="auto auto auto"
        mx="auto"
        minH="520px"
      >
        <GridItem
          rowSpan={dbUser?.role === "master" || dbUser?.role === "ccm" ? 3 : 2}
          bg="white"
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
            // name={`${dbUser?.firstName} ${dbUser?.lastName}`}
            src={currentUser?.photoURL}
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
            paddingTop="32px"
          >
            {dbUser?.email}
          </Text>
        </GridItem>

        <GridItem
          bg="white"
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
          bg="white"
          p="1.5em"
          borderColor="gray.200"
          marginBottom="60px"
        >
          <PersonalInfo />
        </GridItem>

        {dbUser?.role === "master" || dbUser?.role === "ccm" ? (
          <>
            <GridItem
              bg="white"
              p="1.5em"
              borderColor="gray.200"
              ml="80px"
              marginBottom="60px"
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
              bg="white"
              p="1.5em"
              borderColor="gray.200"
            >
              <QuotaCalcFactor />
            </GridItem>
          </>
        ) : (
          <></>
        )}

        <GridItem
          bg="white"
          p="1.5em"
          ml="80px"
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
          bg="white"
          p="1.5em"
        >
          <SignOutSection />
        </GridItem>
      </Grid>
    </Box>
  );
}
