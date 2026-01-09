import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Progress,
  Select,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { FaPlus } from "react-icons/fa6";

function ProviderDropdown() {
  const [providers, setProviders] = useState([]);
  const { backend } = useBackendContext();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await backend.get("/providers?expand=user");
        setProviders(res.data);
      } catch (err) {
        console.log("Error fetching providers:", err);
      }
    };
    fetchProviders();
  }, [backend]);

  return (
    <FormControl>
      <FormLabel>Provider</FormLabel>
      <Select placeholder="Select provider">
        {providers &&
          providers.map((provider) => (
            <option key={provider.id}>
              Dr. {provider.firstName} {provider.lastName}
            </option>
          ))}
      </Select>
    </FormControl>
  );
}

function QuotaProgress() {
  const [quota, setQuota] = useState(0); // total
  const [used, setUsed] = useState(0); // used

  return (
    <FormControl>
      <FormLabel>Progress</FormLabel>

      <Box
        bg="gray.600"
        p={4}
        borderRadius="md"
      >
        {/* bar */}
        <Box
          bg="white"
          borderRadius="sm"
          p={1}
        >
          <Progress
            value={quota === 0 ? 0 : (used / quota) * 100}
            height="28px"
            borderRadius="sm"
            bg="white"
          />
        </Box>

        {/* editable used/total */}
        <VStack
          mt={6}
          spacing={0}
          align="center"
        >
          <HStack
            spacing={3}
            align="baseline"
          >
            <NumberInput
              value={used}
              min={0}
              onChange={(_, v) => setUsed(v)}
              variant="unstyled"
              w="auto"
            >
              <NumberInputField
                textAlign="right"
                fontSize="72px"
                fontWeight="300"
                lineHeight="1"
                color="white"
                p={0}
                w="110px"
              />
            </NumberInput>

            <Text
              color="white"
              fontSize="72px"
              fontWeight="300"
              lineHeight="1"
            >
              /
            </Text>

            <NumberInput
              value={quota}
              min={0}
              onChange={(_, v) => setQuota(v)}
              variant="unstyled"
              w="auto"
            >
              <NumberInputField
                textAlign="left"
                fontSize="72px"
                fontWeight="300"
                lineHeight="1"
                color="white"
                p={0}
                w="110px"
              />
            </NumberInput>
          </HStack>
        </VStack>
      </Box>
    </FormControl>
  );
}

const HoursInput = () => {
  return (
    <Stack
      direction="row"
      gap={2}
    >
      <FormControl>
        <FormLabel>Start Time</FormLabel>
        <Input type="time" />
      </FormControl>
      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input type="time" />
      </FormControl>
    </Stack>
  );
};

const DateInput = () => {
  return (
    <FormControl>
      <FormLabel>Date</FormLabel>
      <Input type="date" />
    </FormControl>
  );
};

const TypeInput = ({ value, onChange }) => {
  return (
    <FormControl>
      <FormLabel>Type</FormLabel>
      <ButtonGroup isAttached>
        <Button
          value="inperson"
          variant={value === "inperson" ? "solid" : "outline"}
          colorScheme={value === "inperson" ? "blue" : "gray"}
          onClick={() => onChange("inperson")}
        >
          In-person
        </Button>
        <Button
          value="online"
          variant={value === "online" ? "solid" : "outline"}
          colorScheme={value === "online" ? "blue" : "gray"}
          onClick={() => onChange("online")}
        >
          Online
        </Button>
      </ButtonGroup>
    </FormControl>
  );
};

function QuotaForm() {
  const [formData, setFormData] = useState({
    providerId: null,
    startTime: "",
    endTime: "",
    date: "",
    type: "inperson",
  });

  return (
    <form>
      <Stack gap={4}>
        <ProviderDropdown />
        <HoursInput />
        <DateInput />
        <TypeInput />
        <QuotaProgress />
      </Stack>
    </form>
  );
}

export default function QuotaDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button
        ref={btnRef}
        rightIcon={<FaPlus />}
        onClick={onOpen}
      >
        Create Quota
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Quota</DrawerHeader>

          <DrawerBody>
            <QuotaForm />
          </DrawerBody>

          <DrawerFooter>
            <Stack
              direction="row"
              justify="space-between"
              w="100%"
              pt={8}
              mt={6}
            >
              <Button
                type="submit"
                borderRadius="10px"
                px={10}
              >
                Save
              </Button>

              <Button
                type="button"
                variant="outline"
                borderRadius="10px"
                px={10}
                onClick={onClose}
              >
                Cancel
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
