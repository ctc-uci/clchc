import React, { useEffect, useRef, useState } from "react";

// import { AiOutlineExclamationCircle } from "react-icons/ai";

import {
  Box,
  Button,
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
  Textarea,
  Text,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";

import { useLocations } from "@/contexts/hooks/data-fetching/useLocations";
import { useProvidersSummary } from "@/contexts/hooks/data-fetching/useProviders";
import {
  useCreateQuota,
  useDeleteQuota,
  useQuotaById,
  useUpdateQuota,
} from "@/contexts/hooks/data-fetching/useQuotas";
import { useUserByFirebaseUid } from "@/contexts/hooks/data-fetching/useUsers";
import { useCreateLog } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { AlertCircle, LockKeyhole } from "lucide-react";

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

const SkeletonBody = () => {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i}
          height="15%"
          margin="20px"
        />
      ))}
    </>
  );
};

const actionMessage = {
  delete: "Please confirm you would like to delete this quota.",
  save: "Please confirm you would like to make these changes to the quota.",
  create: "Please confirm you would like to create a new provider with the following information.",
}

const drawerTitle = {

  delete: "Delete Quota",
  edit: "Edit Quota",
  create: "Create Quota",
}

const LockRightElement = (props) => (
  <InputRightElement
    pointerEvents="none"
    color="gray.400"
    h="100%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    {...props}
  >
    <Box
      as={LockKeyhole}
      w="clamp(12px, 40%, 16px)"
      h="clamp(12px, 40%, 16px)"
    />
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

function formatDateForDisplay(value) {
  const normalized = formatDateForInput(value);
  if (!normalized) return "";
  const [yyyy, mm, dd] = normalized.split("-");
  return `${mm}/${dd}/${yyyy}`;
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

function formatTimeForDisplay(value) {
  const normalized = formatTimeForInput(value);
  if (!normalized) return "";

  const [hoursString, minutes] = normalized.split(":");
  const hours = Number(hoursString);
  if (Number.isNaN(hours)) return normalized;

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${suffix}`;
}

function ProviderDropdown({ providerId, setProviderId, isLocked }) {
  const {
    data: providers = [],
    isLoading: loadingSummary,
  } = useProvidersSummary();

  if (loadingSummary) {
    return (
      <>
    <Skeleton height="16px" mb={2} />
    <Skeleton height="40px" />
    </>
    );
  }

  const selectedProvider = providers.find(
    (provider) => String(provider.id) === String(providerId)
  );

  return (
    <FormControl
      isRequired
      isDisabled={isLocked}
    >
      <FormLabel>Provider</FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {selectedProvider?.name ?? ""}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
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
        </InputGroup>
      )}
    </FormControl>
  );
}

function LocationDropdown({ locationId, setLocationId, isLocked }) {
  const {
    data: locations = [],
    isLoading: loadingLocations,
  } = useLocations();

  if (loadingLocations) {
    return (
    <FormControl w="50%">
      <Skeleton height="16px" mb={2} />
      <Skeleton height="40px" borderRadius="6px" />
    </FormControl>
  );
  }

  const selectedLocation = locations.find(
    (location) => String(location.id) === String(locationId)
  );

  return (
    <FormControl
      isRequired
      w="50%"
      isDisabled={isLocked}
    >
      <FormLabel>Location</FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {selectedLocation?.tagValue ?? ""}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
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
        </InputGroup>
      )}
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
  const handleStartTimeChange = (value) => {
    setStartTime(value);

    if (endTime && value && endTime < value) {
      setEndTime("");
    }
  };

  const handleEndTimeChange = (value) => {
    if (startTime && value && value < startTime) {
      return;
    }

    setEndTime(value);
  };

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
        <Flex
          gap={2}
          minW={0}
        >
          {isLocked ? (
            <>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Box
                  w="100%"
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="6px"
                  px={3}
                  py={2}
                  bg="gray.50"
                  color="gray.500"
                >
                  {formatTimeForDisplay(startTime)}
                </Box>
              </InputGroup>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Box
                  w="100%"
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="6px"
                  px={3}
                  py={2}
                  bg="gray.50"
                  color="gray.500"
                >
                  {formatTimeForDisplay(endTime)}
                </Box>
              </InputGroup>
            </>
          ) : (
            <>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Input
                  size="md"
                  type="time"
                  fontSize="sm"
                  px={3}
                  {...inputStyles}
                  w="100%"
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      display: "none",
                    },
                    "&::-webkit-clear-button": {
                      display: "none",
                    },
                    "&::-webkit-inner-spin-button": {
                      display: "none",
                    },
                  }}
                  value={startTime ?? ""}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />
              </InputGroup>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Input
                  size="md"
                  type="time"
                  fontSize="sm"
                  px={3}
                  {...inputStyles}
                  w="100%"
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      display: "none",
                    },
                    "&::-webkit-clear-button": {
                      display: "none",
                    },
                    "&::-webkit-inner-spin-button": {
                      display: "none",
                    },
                  }}
                  min={startTime || undefined}
                  value={endTime ?? ""}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />
              </InputGroup>
            </>
          )}
        </Flex>
      </FormControl>
    </Flex>
  );
};

const DateInput = ({ date, setDate, isLocked }) => {
  return (
    <FormControl
      isRequired
      w="45%"
      isDisabled={isLocked}
    >
      <FormLabel>Date</FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {formatDateForDisplay(date)}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <Input
          size="md"
          type="date"
          {...inputStyles}
          pr={isLocked ? "2.25rem" : undefined}
          value={date ?? ""}
          onChange={(e) => setDate(e.target.value)}
        />
      )}
    </FormControl>
  );
};

const TypeInput = ({ type, setType, isLocked }) => {
  return (
    <FormControl
      w="43%"
      isDisabled={isLocked}
    >
      <FormLabel>Type</FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {type}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
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
      )}
    </FormControl>
  );
};

const DailyNoteInput = ({ note, setNote, isLocked }) => {
  return (
    <FormControl isDisabled={isLocked}>
      <FormLabel>Daily Notes</FormLabel>
      {isLocked ? (
        <Box
          w="100%"
          border="1px"
          borderColor="gray.300"
          borderRadius="6px"
          px={3}
          py={2}
          minH="70px"
          bg="gray.50"
          color="gray.500"
          whiteSpace="pre-wrap"
        >
          {note ?? ""}
        </Box>
      ) : (
        <Textarea
          placeholder="Start typing..."
          size="md"
          minH="70px"
          resize="vertical"
          {...inputStyles}
          value={note ?? ""}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
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
  // const onOpen = externalOnOpen || internalDisclosure.onOpen;
  const onClose = externalOnClose || internalDisclosure.onClose;
  const btnRef = React.useRef();
  const { currentUser } = useAuthContext();
  const [quota, setQuota] = useState(0);
  const {
    data: quotaData,
    isLoading,
  } = useQuotaById(quotaID, isOpen && !!quotaID);
  const {
    mutate: createQuota,
  } = useCreateQuota();
  const {
    mutate: updateQuota,
  } = useUpdateQuota();
  const {
    mutate: deleteQuota,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteQuota();

  const [providerId, setProviderId] = useState("");
  // const [apptCalcFactor, setApptCalcFactor] = useState(null);
  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [action, setAction] = useState("");
  const [originalProgress, setOriginalProgress] = useState(0);

  const {
    data: userData,
  } = useUserByFirebaseUid(currentUser.uid);
  const {
    mutate: createLog,
  } = useCreateLog();
  const apptCalcFactor = userData?.[0]?.apptCalcFactor ?? null;
  const currentDrawerTitle = !quotaID
    ? drawerTitle.create
    : isLocked && action === "delete"
      ? drawerTitle.delete
      : drawerTitle.edit;

  useEffect(() => {
    // Auto-calculate quota based on total hours and apptCalcFactor
    if (!startTime || !endTime || !apptCalcFactor) return;

    try {
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
        setOriginalProgress(quotaData.progress ?? 0);
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
      setOriginalProgress(0);
      setIsLocked(false);
      setAction("");
    }
  }, [isOpen, quotaID, defaultDate]);
  // const handleTestFill = () => {
  //   if (!isDev || isLocked) return;
  //   setProviderId(1);
  //   setLocationId(1);
  //   setDate(formatDateForInput(new Date()));
  //   setStartTime("09:00");
  //   setEndTime("17:00");
  //   setType("inperson");
  //   setNote("Test note");
  //   setQuota(5);
  //   setProgress(3);
  // };

  const handleSubmit = async (e, nextAction) => {

    e.preventDefault();
    const effectiveAction = nextAction ?? action;

    if (
      startTime &&
      endTime &&
      formatTimeForInput(endTime) < formatTimeForInput(startTime)
    ) {
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

    if (!isLocked) {
      setIsLocked(true);
      if(!quotaID){
        setAction("create");
        return;
      }
      setAction(effectiveAction || "save");
      return;
    }

    try {
      //create
      if (!quotaID) {
        await createQuota(formData);
      }
      //delete
      else if (effectiveAction === "delete") {
        await deleteQuota({ id: quotaID });
        handleClose();
      }
      //update
      else {
        await updateQuota({ id: quotaID, data: formData });
      }
      if (progress !== originalProgress && quotaID) {
        /* If the new progress is not the same as the original, 
       use a POST endpoint to the /VersionLog route */
        try {
          await createLog({
            userId: userData?.[0]?.id ?? null,
            quotaId: quotaID,
            action: progress > originalProgress ? "increment" : "decrement",
            delta: progress - originalProgress,
          });
        } catch (err) {
          console.error("Error logging quota change to version log:", err);
        }
      }
      handleClose();
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
    setAction("");
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
        <DrawerHeader>{currentDrawerTitle}</DrawerHeader>
        
        {isLoading ? <SkeletonBody /> :
        <form onSubmit={handleSubmit}>
          <DrawerBody pb={24}>
            <Stack gap={4}>
              {isLocked && (
                <Box
                  bg="#FFD2D2"
                  borderRadius="8px"
                  p={4}
                  border="2px solid"
                  borderColor="#CE0000"
                >
                  <Stack
                    direction="row"
                    align="center"
                    // spacing={3}
                    mb={4}
                  >
                    <AlertCircle
                      size={24}
                      color="#CE0000"
                    />
                    <Text
                      fontWeight="semibold"
                      color="#CE0000"
                      display="flex"
                      alignItems="center"
                      lineHeight="1"
                    >
                      Notification
                    </Text>
                  </Stack>

                  <Text
                    fontSize="sm"
                    color="#CE0000"
                  >
                    {actionMessage[action ? action : 'create']}
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
              {isLocked ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    px={10}
                    width="50%"
                    onClick={() => {
                      setIsLocked(false);
                      setAction("");
                    }}
                    borderRadius="4px"
                    borderColor="#0000003D"
                  >
                    Continue Editing
                  </Button>

                  <Button
                    type="submit"
                    px={10}
                    width="50%"
                    bg="black"
                    color="white"
                    borderRadius="4px"
                  >
                    {action === "delete" ? "Delete" : "Confirm"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    px={10}
                    width="50%"
                    onClick={(e) => {
                      if (!quotaID) {
                        handleClose();
                        return;
                      }
                      handleSubmit(e, "delete");
                    }}
                    borderRadius="4px"
                    borderColor="#0000003D"
                  >
                    {!quotaID ? "Cancel" : "Delete Quota"}
                  </Button>

                  <Button
                    // type="submit"
                    px={10}
                    width="50%"
                    bg="black"
                    color="white"
                    borderRadius="4px"
                    onClick={(e) => {
                      handleSubmit(e, "save");
                    }}
                  >
                    {!quotaID ? "Save" : "Save Changes"}
                  </Button>
                </>
              )}
            </Stack>
          </DrawerFooter>
        </form>
            }
      </DrawerContent>
    </Drawer>
  );
}
