import React, { useEffect, useState } from "react";

import { LockIcon } from "@chakra-ui/icons";
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
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Progress,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
// bowen

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

const MAX_INPUT_NUMBER = 99;

const TYPE_OPTIONS = [
  { value: "inperson", label: "In-person" },
  { value: "telehealth", label: "Telehealth" },
];

const inputStyles = {
  bg: "white",
  borderColor: "gray.300",
  borderRadius: "6px",
  _placeholder: { color: "gray.400" },
  _disabled: { bg: "gray.50", color: "gray.500", opacity: 1 },
};

const selectStyles = {
  bg: "white",
  borderColor: "gray.300",
  borderRadius: "6px",
  _placeholder: { color: "gray.400" },
  _disabled: { bg: "gray.50", color: "gray.500", opacity: 1 },
};

const LockRightElement = () => (
  <InputRightElement
    pointerEvents="none"
    color="gray.400"
  >
    <LockIcon boxSize={3} />
  </InputRightElement>
);

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

function ProviderDropdown({ providerId, setProviderId, isLocked }) {
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
    <FormControl
      isRequired
      isDisabled={isLocked}
    >
      <FormLabel>Provider</FormLabel>
      <InputGroup>
        <Select
          {...selectStyles}
          placeholder=" "
          pr={isLocked ? "2.25rem" : undefined}
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
        {isLocked && <LockRightElement />}
      </InputGroup>
    </FormControl>
  );
}

function LocationDropdown({ locationId, setLocationId, isLocked }) {
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
    <FormControl
      isRequired
      w="50%"
      isDisabled={isLocked}
    >
      <FormLabel>Location</FormLabel>
      <InputGroup>
        <Select
          {...selectStyles}
          placeholder=" "
          pr={isLocked ? "2.25rem" : undefined}
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
        {isLocked && <LockRightElement />}
      </InputGroup>
    </FormControl>
  );
}

function QuotaProgress({ quota, setQuota, progress, setProgress, isLocked }) {
  const safeQuota = Number(quota) || 0;
  const safeProgress = Number(progress) || 0;
  const percent = safeQuota === 0 ? 0 : (safeProgress / safeQuota) * 100;

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
    <FormControl
      isRequired
      isDisabled={isLocked}
    >
      <FormLabel>Appointment Quota</FormLabel>
      <>
        <Progress
          value={percent}
          height="10px"
          borderRadius="999px"
          bg="gray.200"
          my={2}
          colorScheme="green"
        />
        <Box
          px={4}
          borderRadius="md"
          display="flex"
          flexDirection="column"
        >
          <Stack
            direction="row"
            align="center"
            justify="center"
            color="white"
            height="92px"
            gap="40px"
          >
            <Box
              position="relative"
              w="80px"
            >
              <NumberInput
                value={progress}
                min={0}
                max={MAX_INPUT_NUMBER}
                variant="unstyled"
                onChange={numberInputHandlerFactory(setProgress)}
                border="1px"
                borderColor="gray.300"
                borderRadius="6px"
                size="lg"
                w="80px"
              >
                <NumberInputField
                  textAlign="center"
                  fontSize="4xl"
                  p={0}
                  color="black"
                  placeholder=" "
                  bg="white"
                  borderRadius="6px"
                  h="64px"
                  // pr={isLocked ? "1.75rem" : undefined}
                />
              </NumberInput>
              {/* {isLocked && (
                <Box
                  position="absolute"
                  right="8px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  <LockIcon boxSize={3} />
                </Box>
              )} */}
            </Box>

            <Text
              fontSize="4xl"
              fontWeight="bold"
              color="black"
              // mx={10}
            >
              /
            </Text>

            <Box
              position="relative"
              w="80px"
            >
              <NumberInput
                value={quota}
                size="lg"
                min={0}
                max={MAX_INPUT_NUMBER}
                variant="unstyled"
                onChange={numberInputHandlerFactory(setQuota)}
                border="1px"
                borderColor="gray.300"
                borderRadius="6px"
                w="80px"
              >
                <NumberInputField
                  textAlign="center"
                  fontSize="4xl"
                  p={0}
                  color="black"
                  bg="white"
                  borderRadius="6px"
                  h="64px"
                  // pr={isLocked ? "1.75rem" : undefined}
                />
              </NumberInput>
              {/* {isLocked && (
                <Box
                  position="absolute"
                  right="8px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  <LockIcon boxSize={3} />
                </Box>
              )} */}
            </Box>
          </Stack>
        </Box>
      </>
    </FormControl>
  );
}

const TimeInput = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isLocked,
}) => {
  return (
    <Flex
      direction="column"
      // paddingLeft={4}
      width="50%"
    >
      <FormControl
        isRequired
        isDisabled={isLocked}
      >
        <FormLabel>Hours</FormLabel>
        <Flex>
          <InputGroup marginRight={2}>
            <Input
              size="md"
              type="text"
              {...inputStyles}
              pr={isLocked ? "2.25rem" : undefined}
              value={startTime ?? ""}
              onChange={(e) => setStartTime(e.target.value)}
            />
            {/* {isLocked && <LockRightElement />} */}
          </InputGroup>
          <InputGroup>
            <Input
              size="md"
              type="text"
              {...inputStyles}
              pr={isLocked ? "2.25rem" : undefined}
              value={endTime ?? ""}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {/* {isLocked && <LockRightElement />} */}
          </InputGroup>
        </Flex>
      </FormControl>
    </Flex>
  );
};

// Alternative time input with AM/PM selectors (commented out for now since it adds complexity and we don't have a clear use case for it yet)
// const TimeInput = ({ startTime, setStartTime, endTime, setEndTime }) => {
//   return (
//     <Flex
//       direction="column"
//       // paddingLeft={4}
//       width="50%"
//     >
//       <FormControl isRequired>
//         <FormLabel>Hours</FormLabel>
//         <Flex>
//           <InputGroup
//             size="md"
//             marginRight={2}
//           >
//             <Input
//               type="text"
//               value={startTime ?? ""}
//               onChange={(e) => setStartTime(e.target.value)}
//             />
//             <InputRightAddon bg="white">AM</InputRightAddon>
//           </InputGroup>
//           <InputGroup size="md">
//             <Input
//               type="text"
//               value={endTime ?? ""}
//               onChange={(e) => setEndTime(e.target.value)}
//             />
//             <InputRightAddon bg="white">PM</InputRightAddon>
//           </InputGroup>
//         </Flex>
//       </FormControl>
//     </Flex>
//   );
// };
const DateInput = ({ date, setDate, isLocked }) => {
  return (
    <FormControl
      isRequired
      w="45%"
      isDisabled={isLocked}
    >
      <FormLabel>Date</FormLabel>
      <Input
        size="md"
        type="date"
        {...inputStyles}
        pr={isLocked ? "2.25rem" : undefined}
        value={date ?? ""}
        onChange={(e) => setDate(e.target.value)}
      />
      {isLocked && (
        <Box
          position="absolute"
          right="10px"
          top="38px"
          color="gray.400"
          pointerEvents="none"
        >
          <LockIcon boxSize={3} />
        </Box>
      )}
    </FormControl>
  );
};

const TypeInput = ({ type, setType, isLocked }) => {
  return (
    // <FormControl>
    //   <FormLabel>Type</FormLabel>

    //   <ButtonGroup isAttached>
    //     {TYPE_OPTIONS.map(({ value, label }) => {
    //       const selected = type === value;

    //       return (
    //         <Button
    //           key={value}
    //           aria-pressed={selected}
    //           variant={selected ? "solid" : "outline"}
    //           colorScheme={selected ? "blue" : "gray"}
    //           onClick={() => setType(value)}
    //         >
    //           {label}
    //         </Button>
    //       );
    //     })}
    //   </ButtonGroup>
    // </FormControl>
    <FormControl
      w="43%"
      isDisabled={isLocked}
    >
      <FormLabel>Type</FormLabel>
      <InputGroup>
        <Select
          {...selectStyles}
          placeholder=" "
          pr={isLocked ? "2.25rem" : undefined}
          value={type ?? ""}
          onChange={(e) => setType(e.target.value)}
        >
          {TYPE_OPTIONS.map(({ value, label }) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </Select>
        {isLocked && <LockRightElement />}
      </InputGroup>
    </FormControl>
  );
};

const DailyNoteInput = ({ note, setNote, isLocked }) => {
  return (
    <FormControl isDisabled={isLocked}>
      <FormLabel>Daily Notes</FormLabel>
      <InputGroup>
        <Input
          placeholder="Start typing..."
          size="md"
          type="text"
          {...inputStyles}
          pr={isLocked ? "2.25rem" : undefined}
          value={note ?? ""}
          onChange={(e) => setNote(e.target.value)}
        />
        {isLocked && <LockRightElement />}
      </InputGroup>
    </FormControl>
  );
};

export default function QuotaDrawer({
  quotaID = 0,
  isOpen: externalIsOpen,
  onOpen: externalOnOpen,
  onClose: externalOnClose,
  defaultDate,
}) {
  const internalDisclosure = useDisclosure();
  const isOpen =
    externalIsOpen !== undefined ? externalIsOpen : internalDisclosure.isOpen;
  const onOpen = externalOnOpen || internalDisclosure.onOpen;
  const onClose = externalOnClose || internalDisclosure.onClose;
  const btnRef = React.useRef();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();

  const [providerId, setProviderId] = useState("");
  const [apptCalcFactor, setApptCalcFactor] = useState(null);
  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [quota, setQuota] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  // const [lockEdit, setLockEdit] = useState(false);
  const isDev = import.meta.env?.DEV;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser?.uid) {
        console.log("No currentUser available yet");
        return;
      }

      try {
        console.log("Fetching user profile for:", currentUser.uid);
        const res = await backend.get(`/users/${currentUser.uid}`);
        const userData = res.data[0];
        console.log("User data:", userData);
        const factor = userData?.apptCalcFactor ?? null;
        console.log("apptCalcFactor:", factor);
        setApptCalcFactor(factor);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [currentUser, backend]);

  useEffect(() => {
    // Auto-calculate quota based on total hours and apptCalcFactor
    if (quotaID || !startTime || !endTime || apptCalcFactor === null) return;

    try {
      console.log(
        "Calculating quota with startTime:",
        startTime,
        "endTime:",
        endTime,
        "and apptCalcFactor:",
        apptCalcFactor
      );

      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      if (
        isNaN(startHours) ||
        isNaN(startMinutes) ||
        isNaN(endHours) ||
        isNaN(endMinutes)
      )
        return;

      // Calculate total hours between start and end time
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      const totalHours = (endTotalMinutes - startTotalMinutes) / 60;

      if (totalHours <= 0) return; // Invalid time range

      // Calculate default quota: total hours * factor
      const calculatedQuota = Math.round(totalHours * apptCalcFactor);
      console.log("Calculated quota:", calculatedQuota);

      setQuota(calculatedQuota);
    } catch (err) {
      console.error("Error calculating quota:", err);
    }
  }, [quotaID, startTime, endTime, apptCalcFactor]);

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
        setType(quotaData.appointmentType ?? "");
        setNote(quotaData.notes ?? "");
        setQuota(quotaData.quota ?? 0);
        setProgress(quotaData.progress ?? 0);
        setNote(quotaData.notes ?? "");
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
      setDate(defaultDate ? formatDateForInput(defaultDate) : "");
      setNote("");
      setQuota(0);
      setProgress(0);
      setIsLocked(false);
    }
  }, [isOpen, quotaID, backend, defaultDate]);
  const handleTestFill = () => {
    if (!isDev || isLocked) return;
    setProviderId(1);
    setLocationId(1);
    setDate(formatDateForInput(new Date()));
    setStartTime("09:00");
    setEndTime("17:00");
    setType("inperson");
    setNote("Test note");
    setQuota(5);
    setProgress(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      handleClose();
      return;
    }

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
      notes: note,
    };

    try {
      if (quotaID) {
        console.log("Updating quota with ID:", quotaID, "Data:", formData);
        await backend.put(`/quota/${quotaID}`, formData);
        setIsLocked(true);
      } else {
        await backend.post("/quota", formData);
        setIsLocked(true);
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
    setType("");
    setNote("");
    setQuota(0);
    setProgress(0);
    setIsLocked(false);
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
          <DrawerBody pb={24}>
            <Stack gap={4}>
              {isDev && !isLocked && (
                <Flex justify="flex-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleTestFill}
                  >
                    Fill Test Data
                  </Button>
                </Flex>
              )}
              {isLocked && (
                <Box
                  bg="#DDDDDD"
                  borderRadius="8px"
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Stack
                    direction="row"
                    align="center"
                    spacing={3}
                    mb={4}
                  >
                    <Box
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      // bg="white"
                      border="1px solid"
                      borderColor="black"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      i
                    </Box>
                    <Text fontWeight="semibold">Notification</Text>
                  </Stack>

                  <Text
                    fontSize="sm"
                    color="gray.700"
                  >
                    Please confirm you would like to create a new provider with
                    the following information
                  </Text>
                </Box>
              )}
              <ProviderDropdown
                providerId={providerId}
                setProviderId={setProviderId}
                isLocked={isLocked}
              />
              <Flex justify="space-between">
                <DateInput
                  date={date}
                  setDate={setDate}
                  isLocked={isLocked}
                />
                <TimeInput
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  isLocked={isLocked}
                />
              </Flex>
              <Flex justify="space-between">
                <LocationDropdown
                  locationId={locationId}
                  setLocationId={setLocationId}
                  isLocked={isLocked}
                />

                <TypeInput
                  type={type}
                  setType={setType}
                  isLocked={isLocked}
                />
              </Flex>

              <DailyNoteInput
                note={note}
                setNote={setNote}
                isLocked={isLocked}
              />

              <QuotaProgress
                quota={quota}
                setQuota={setQuota}
                progress={progress}
                setProgress={setProgress}
                isLocked={isLocked}
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter
            position="absolute"
            bottom={0}
            w="100%"
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <Stack
              direction="row"
              justify="space-between"
              w="100%"
              gap="20px"
            >
              <Button
                type="button"
                variant="outline"
                px={10}
                width="50%"
                onClick={isLocked ? () => setIsLocked(false) : handleClose}
                borderRadius="4px"
                borderColor="#0000003D"
              >
                {isLocked ? "Continue Editing" : "Cancel"}
              </Button>

              <Button
                type="submit"
                px={10}
                width="50%"
                bg="black"
                color="white"
                borderRadius="4px"
              >
                {isLocked ? "Confirm" : "Save"}
              </Button>
            </Stack>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
