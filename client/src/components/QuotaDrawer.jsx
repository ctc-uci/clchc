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
  Input,
  NumberInput,
  NumberInputField,
  Progress,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { FaPlus } from "react-icons/fa6";

function ProviderDropdown({ providerId, setProviderId }) {
  const [providers, setProviders] = useState(null);
  const { backend } = useBackendContext();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await backend.get("/providers?expand=user");
        setProviders(res.data);
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };
    fetchProviders();
  }, [backend]);

  return (
    <FormControl isRequired>
      <FormLabel>Provider</FormLabel>
      <Select
        placeholder="Select provider"
        value={providerId}
        onChange={(e) => setProviderId(Number(e.target.value))}
      >
        {providers &&
          providers.map((provider) => (
            <option
              key={provider.id}
              value={provider.id}
            >
              Dr. {provider.firstName} {provider.lastName}
            </option>
          ))}
      </Select>
    </FormControl>
  );
}

function LocationDropdown({ locationId, setLocationId }) {
  const [locations, setLocations] = useState(null);
  const { backend } = useBackendContext();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await backend.get("/location");
        setLocations(res.data);
      } catch (err) {
        console.log("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, [backend]);

  return (
    <FormControl isRequired>
      <FormLabel>Location</FormLabel>
      <Select
        placeholder="Select location"
        value={locationId}
        onChange={(e) => setLocationId(Number(e.target.value))}
      >
        {locations &&
          locations.map((location) => (
            <option
              key={location.id}
              value={location.id}
            >
              {location.tagValue}
            </option>
          ))}
      </Select>
    </FormControl>
  );
}

function QuotaProgress({ quota, setQuota, progress, setProgress }) {
  const MAX_INPUT_NUMBER = 99;

  const percent = quota === 0 ? 0 : (progress / quota) * 100;

  const numberInputHandlerFactory = (inputName) => {
    let setStateFn;

    if (inputName === "quota") {
      setStateFn = setQuota;
    } else if (inputName === "progress") {
      setStateFn = setProgress;
    } else {
      return () => {}; // in case of invalid case
    }

    return (valueAsString, valueAsNumber) => {
      if (Number.isNaN(valueAsNumber)) {
        setStateFn(0);
        return;
      }
      if (valueAsNumber > MAX_INPUT_NUMBER) {
        return;
      }
      setStateFn(valueAsNumber);
    };
  };

  return (
    <FormControl isRequired>
      <FormLabel>Progress</FormLabel>

      <Box
        bg="gray"
        p={4}
        borderRadius="md"
        display="flex"
        flexDirection="column"
      >
        <Box
          bg="white"
          borderRadius="sm"
          p={1}
        >
          <Progress
            value={percent}
            height="32px"
            borderRadius="sm"
            bg="white"
          />
        </Box>

        <Stack
          direction="row"
          align="center"
          justify="center"
          color="white"
        >
          <NumberInput
            value={progress}
            min={0}
            max={MAX_INPUT_NUMBER}
            variant="unstyled"
            onChange={numberInputHandlerFactory("progress")}
          >
            <NumberInputField
              textAlign="right"
              fontSize="6xl"
              p={0}
            />
          </NumberInput>

          <Text fontSize="6xl">/</Text>

          <NumberInput
            value={quota}
            size="lg"
            min={0}
            max={MAX_INPUT_NUMBER}
            variant="unstyled"
            onChange={numberInputHandlerFactory("quota")}
          >
            <NumberInputField
              textAlign="left"
              fontSize="6xl"
              p={0}
            />
          </NumberInput>
        </Stack>
      </Box>
    </FormControl>
  );
}

const TimeInput = ({ startTime, setStartTime, endTime, setEndTime }) => {
  return (
    <Stack
      direction="row"
      gap={2}
    >
      <FormControl isRequired>
        <FormLabel>Start Time</FormLabel>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </FormControl>
    </Stack>
  );
};

const DateInput = ({ date, setDate }) => {
  return (
    <FormControl isRequired>
      <FormLabel>Date</FormLabel>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </FormControl>
  );
};

const TypeInput = ({ type, setType }) => {
  return (
    <FormControl>
      <FormLabel>Type</FormLabel>
      <ButtonGroup isAttached>
        <Button
          value="inperson"
          aria-pressed={type === "inperson"}
          variant={type === "inperson" ? "solid" : "outline"}
          colorScheme={type === "inperson" ? "blue" : "gray"}
          onClick={() => setType("inperson")}
        >
          In-person
        </Button>
        <Button
          value="online"
          aria-pressed={type === "online"}
          variant={type === "online" ? "solid" : "outline"}
          colorScheme={type === "online" ? "blue" : "gray"}
          onClick={() => setType("online")}
        >
          Online
        </Button>
      </ButtonGroup>
    </FormControl>
  );
};

export default function QuotaDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { backend } = useBackendContext();

  const [providerId, setProviderId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("inperson");
  const [quota, setQuota] = useState(0);
  const [progress, setProgress] = useState(0);

  // Helper function to convert time string to int
  const getHoursBetween = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    let diffMin = endTotal - startTotal;

    if (diffMin < 0) {
      diffMin += 24 * 60;
    }

    return Math.floor(diffMin / 60);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      providerId,
      locationId,
      quota,
      progress,
      hours: getHoursBetween(startTime, endTime),
      appointmentType: type,
      notes: "", // TODO: Is there an initial notes flow?
    };

    try {
      await backend.post("/quota", formData);
      handleClose();
      // TODO: Should we redirect to the new quota page?
    } catch (err) {
      console.error("Error creating a new quota:", err);
    }
  };

  const handleClose = () => {
    setProviderId("");
    setLocationId("");
    setStartTime("");
    setEndTime("");
    setDate("");
    setType("inperson");
    setQuota(0);
    setProgress(0);
    onClose();
  };

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
        placement="left"
        onClose={handleClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Quota</DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack gap={4}>
                <ProviderDropdown
                  providerId={providerId}
                  setProviderId={setProviderId}
                />
                <LocationDropdown
                  locationId={locationId}
                  setLocationId={setLocationId}
                />
                <TimeInput
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                />
                <DateInput
                  date={date}
                  setDate={setDate}
                />
                <TypeInput
                  type={type}
                  setType={setType}
                />
                <QuotaProgress
                  quota={quota}
                  setQuota={setQuota}
                  progress={progress}
                  setProgress={setProgress}
                />
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Stack
                direction="row"
                justify="space-between"
                w="100%"
              >
                <Button
                  type="submit"
                  px={10}
                >
                  Save
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  px={10}
                  onClick={handleClose}
                >
                  Discard
                </Button>
              </Stack>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
