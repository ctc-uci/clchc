import {
    Box,
    VStack,
    Image,
    Text,
  } from "@chakra-ui/react";
  import { Login } from "./Login";
  
  export const LoginPage = () => {
    return (
      <Box
        minH="100vh"
        bg="#EDEDED"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={8}
      >
        <Box
          bg="white"
          w="100%"
          maxW="1100px"
          minH="600px"
          borderRadius="md"
          boxShadow="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={10}>
            {/* Logo */}
            <Image
              src="/logo.svg"
              alt="Celebrating Life Community Health Center"
              maxW="420px"
            />
  
            {/* Your existing login form */}
            <Login />
  
            {/* Helper text under Google button (matches screenshot) */}
            <Text
              fontSize="sm"
              color="gray.600"
              textAlign="center"
            >
              Please use your @clchc.org email address to sign in
            </Text>
          </VStack>
        </Box>
      </Box>
    );
  };
  