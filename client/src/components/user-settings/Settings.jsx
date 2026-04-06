import { Avatar, Box, Grid, GridItem, Text } from "@chakra-ui/react";



import { useUserContext } from "@/contexts/hooks/useUserContext";



import PersonalInfo from "./PersonalInfo.jsx";
import QuotaCalcFactor from "./QuotaCalcFactor.jsx";
import SignOutSection from "./SignOutSection.jsx";


export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const CALCULATION_FACTOR = "calculation-factor";

export function Settings() {
  const userData = useUserContext();
  const dbUser = userData?.dbUser;

  return (
    <Box
      paddingTop="60px"
      paddingX="50px"
    >
      <Grid
        templateColumns="220px 400px 500px"
        templateRows="auto auto auto"
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
          width="278px"
        >
          <Avatar
            w="200px"
            h="200px"
            name={`${dbUser?.firstName} ${dbUser?.lastName}`}
          />
          <Text
            fontWeight="bold"
            fontSize="xl"
            textAlign="center"
          >
            {dbUser?.firstName} {dbUser?.lastName}
          </Text>
          <Text
            color="gray.600"
            fontSize="sm"
            textAlign="center"
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
            fontSize="lg"
          >
            Personal Information
          </Text>
          <Text
            fontSize="sm"
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
        >
          <PersonalInfo />
        </GridItem>

        {dbUser.role === "master" || dbUser.role === "ccm" ? (
          <>
            <GridItem
              bg="white"
              p="1.5em"
              borderColor="gray.200"
              ml="80px"
            >
              <Text
                fontWeight="bold"
                fontSize="lg"
              >
                Quota Calculation Factor
              </Text>
              <Text
                fontSize="sm"
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
            fontSize="lg"
          >
            Sign Out
          </Text>
          <Text
            fontSize="sm"
            color="gray.600"
            mt="0.5em"
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
