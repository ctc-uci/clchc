import React, { useEffect, useState } from "react";
// import { Pencil } from 'lucide-react';

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

// bowen

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

const MAX_INPUT_NUMBER = 99;

const TYPE_OPTIONS = [
  { value: "inperson", label: "In-person" },
  { value: "telehealth", label: "Telehealth" },
];

// Helpers to normalize API date/time values for HTML inputs
function formatDateForInput(value) {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatTimeForInput(value) {
  if (!value) return "";
  if (typeof value === "string") {
    // Strings like HH:mm:ss or HH:mm:ssZ → take HH:mm
    const m = value.match(/^(\d{1,2}):(\d{2})/);
    if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
    // ISO datetime → parse to local HH:mm
    if (value.includes("T")) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
      }
    }
  }
  // Date object fallback
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function ProviderDropdown({ providerId, setProviderId }) {
  const [providers, setProviders] = useState(null);
  const { backend } = useBackendContext();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await backend.get("/providers/summary");
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
        value={providerId === "" ? "" : String(providerId)}
        onChange={(e) => {
          setProviderId(Number(e.target.value));
        }}
      >
        {providers &&
          providers.map((provider) => (
            <option
              key={provider.id}
              value={provider.id}
            >
              {provider.name}
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
        value={locationId === "" ? "" : String(locationId)}
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
  const percent = quota === 0 ? 0 : (progress / quota) * 100;

  const numberInputHandlerFactory = (setStateFn) => {
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
            onChange={numberInputHandlerFactory(setProgress)}
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
            onChange={numberInputHandlerFactory(setQuota)}
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
          value={startTime ?? ""}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input
          type="time"
          value={endTime ?? ""}
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
        value={date ?? ""}
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
        {TYPE_OPTIONS.map(({ value, label }) => {
          const selected = type === value;

          return (
            <Button
              key={value}
              aria-pressed={selected}
              variant={selected ? "solid" : "outline"}
              colorScheme={selected ? "blue" : "gray"}
              onClick={() => setType(value)}
            >
              {label}
            </Button>
          );
        })}
      </ButtonGroup>
    </FormControl>
  );
};

export default function QuotaDrawer({ quotaID = 0, isOpen: externalIsOpen, onOpen: externalOnOpen, onClose: externalOnClose }) {
  const internalDisclosure = useDisclosure();
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalDisclosure.isOpen;
  const onOpen = externalOnOpen || internalDisclosure.onOpen;
  const onClose = externalOnClose || internalDisclosure.onClose;
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

  useEffect(() => {
    // Initialize the form each time the drawer opens
    if (!isOpen) return;

    const fetchQuotaDetails = async () => {
      try {
        const res = await backend.get(`/quota/${quotaID}`);
        const quotaData = res.data[0];
        setProviderId(quotaData.providerId ?? "");
        setLocationId(quotaData.locationId ?? "");
        setStartTime(
          quotaData.startTime ? formatTimeForInput(quotaData.startTime) : ""
        );
        setEndTime(
          quotaData.endTime ? formatTimeForInput(quotaData.endTime) : ""
        );
        setDate(quotaData.date ? formatDateForInput(quotaData.date) : "");
        setType(
          quotaData.appointmentType ? quotaData.appointmentType : "inperson"
        );
        setQuota(quotaData.quota ?? 0);
        setProgress(quotaData.progress ?? 0);
      } catch (err) {
        console.error("Error fetching quota details:", err);
      }
    };

    if (quotaID) {
      fetchQuotaDetails();
    } else {
      setProviderId("");
      setLocationId("");
      setStartTime("");
      setEndTime("");
      setDate("");
      setType("inperson");
      setQuota(0);
      setProgress(0);
    }
  }, [isOpen, quotaID, backend]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      providerId,
      locationId,
      quota,
      progress,
      date: formatDateForInput(date),
      startTime: formatTimeForInput(startTime),
      endTime: formatTimeForInput(endTime),
      // hours: getHoursBetween(startTime, endTime),
      appointmentType: type,
      notes: "", // TODO: Is there an initial notes flow?
    };

    try {
      if (quotaID) {
        await backend.put(`/quota/${quotaID}`, formData);
        handleClose();
      } else {
        await backend.post("/quota", formData);
        handleClose();
      }

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
          {quotaID ? (
            <DrawerHeader>Edit Quota</DrawerHeader>
          ) : (
            <DrawerHeader>Create Quota</DrawerHeader>
          )}

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
  );
}
