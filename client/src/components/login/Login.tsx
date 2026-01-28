import { useCallback, useEffect } from "react";

import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { authenticateGoogleUser } from "@/utils/auth/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { login, handleRedirectResult } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const toastLoginError = useCallback(
    (msg: string) => {
      toast({
        title: "An error occurred while signing in",
        description: msg,
        status: "error",
        variant: "subtle",
      });
    },
    [toast]
  );

  const handleLogin = async (data: SigninFormValues) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });

      navigate("/quota-tracking");
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-email":
        case "auth/user-not-found":
          toastLoginError(
            "Email address or password does not match our records!"
          );
          break;
        case "auth/unverified-email":
          toastLoginError("Please verify your email address.");
          break;
        case "auth/user-disabled":
          toastLoginError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          toastLoginError("Too many attempts. Please try again later.");
          break;
        case "auth/user-signed-out":
          toastLoginError("You have been signed out. Please sign in again.");
          break;
        default:
          toastLoginError(firebaseErrorMsg);
      }
    }
  };

  const handleGoogleLogin = async () => {
    await authenticateGoogleUser();
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  return (
    <Box
      mt={64}
      mx={12}
    >
      <VStack
        spacing={6}
        sx={{ width: 500, marginX: "auto" }}
      >
        {/* <Heading>Login</Heading>

      <form
        onSubmit={handleSubmit(handleLogin)}
        style={{ width: "100%" }}
      >
        <Stack spacing={2}>
          <FormControl
            isInvalid={!!errors.email}
            w={"100%"}
          >
            <Center>
              <Input
                placeholder="Email"
                type="email"
                size={"lg"}
                {...register("email")}
                name="email"
                isRequired
                autoComplete="email"
              />
            </Center>
            <FormErrorMessage>
              {errors.email?.message?.toString()}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <Center>
              <Input
                placeholder="Password"
                type="password"
                size={"lg"}
                {...register("password")}
                name="password"
                isRequired
                autoComplete="current-password"
              />
            </Center>
            <FormErrorMessage>
              {errors.password?.message?.toString()}
            </FormErrorMessage>
            <ChakraLink
              as={Link}
              to="/signup"
            >
              <FormHelperText>Click here to sign up</FormHelperText>
            </ChakraLink>
          </FormControl>

          <Button
            type="submit"
            size={"lg"}
            sx={{ width: "100%" }}
            isDisabled={Object.keys(errors).length > 0}
          >
            Login
          </Button>
        </Stack>
      </form> */}
        <Image
          src="/clchc-logo.svg"
          alt="Celebrating Life Community Health Center"
          maxW="600px"
          mb={16}
        />

        <Button
          variant="outline"
          bg="white"
          border="1px solid #DADCE0"
          boxShadow="lg"
          size={"lg"}
          onClick={handleGoogleLogin}
          w="50%"
          justifyContent="flex-start"
        >
          <Image
            src="/google.svg"
            alt="Google"
            boxSize="18px"
            mr={4}
          />
          <Text
            fontSize="md"
            fontWeight="medium"
            color="#3C4043"
          >
            Sign in with Google
          </Text>
        </Button>
        <Text
          fontSize="sm"
          color="#696969"
          fontWeight="semibold"
          textAlign="center"
        >
          Please use your @clchc.org email address to sign in
        </Text>
      </VStack>
    </Box>
  );
};
