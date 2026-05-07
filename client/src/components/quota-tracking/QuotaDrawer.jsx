import React, { useEffect, useState } from "react";

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Skeleton
} from "@chakra-ui/react";
import ToastAlert from "@/components/common/ToastAlert";

import {
  useCreateQuota,
  useDeleteQuota,
  useQuotaById,
  useUpdateQuota,
} from "@/contexts/hooks/data-fetching/useQuotas";
import { useProvidersSummary } from "@/contexts/hooks/data-fetching/useProviders";
import { useLocations } from "@/contexts/hooks/data-fetching/useLocations";
import { useCreateLog } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";

import { DailyNoteInput } from "./quota-drawer/form-fields/DailyNoteInput";
import { DateInput } from "./quota-drawer/form-fields/DateInput";
import { LocationDropdown } from "./quota-drawer/form-fields/LocationDropdown";
import { ProviderDropdown } from "./quota-drawer/form-fields/ProviderDropdown";
import { QuotaProgress } from "./quota-drawer/form-fields/QuotaProgress";
import { TimeInput } from "./quota-drawer/form-fields/TimeInput";
import { TypeInput } from "./quota-drawer/form-fields/TypeInput";
import { NotificationBanner } from "./quota-drawer/NotificationBanner";
import { QuotaDrawerFooter } from "./quota-drawer/QuotaDrawerFooter";
import { drawerTitle } from "./quota-drawer/tools/constants";
import {
  formatDateForInput,
  formatTimeForInput,
} from "./quota-drawer/tools/utils";

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
  const userInfo = useUserContext();
  const [quota, setQuota] = useState(0);
  const { data: quotaData, isLoading: isQuotaByIdLoading } = useQuotaById(
    quotaID,
    isOpen && !!quotaID
  );
  const { data: providers, isLoading: isProvidersLoading } = useProvidersSummary()
  const { data: locationsData, isLoading: isLocationsLoading } = useLocations()
  const locations = locationsData?.locations || [];
  const isDrawerLoading = (quotaID ? isQuotaByIdLoading : false) || isProvidersLoading || isLocationsLoading;
  const { mutate: createQuota } = useCreateQuota();
  const { mutate: updateQuota } = useUpdateQuota();
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
  const [isLocationDifferent, setIsLocationDifferent] = useState(false);
  const [originalProgress, setOriginalProgress] = useState(0);
  const [errors, setErrors] = useState({});

  const { mutate: createLog } = useCreateLog();
  const toast = useToast();

  const apptCalcFactor = userInfo?.dbUser?.apptCalcFactor ?? null;

  const currentDrawerTitle = !quotaID
    ? drawerTitle.create
    : isLocked && action === "delete"
      ? drawerTitle.delete
      : drawerTitle.edit;

  useEffect(() => {
    // Auto-calculate quota based on total hours and apptCalcFactor
    if (!startTime || !endTime || !apptCalcFactor || quotaID) return;

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
      if (!quotaData) return;
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
  }, [isOpen, quotaID, defaultDate, quotaData]);
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

  const validateForm = () => {
    const newErrors = {};
    if (!providerId) newErrors.providerId = true;
    if (!date) newErrors.date = true;
    if (!startTime) newErrors.startTime = true;
    if (!endTime) newErrors.endTime = true;
    if (!locationId) newErrors.locationId = true;
    if (!type) newErrors.type = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      if (!validateForm()) return;
      setIsLocked(true);
      if (!quotaID) {
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
        toast({
          position: "top-right",
          duration: 5000,
          isClosable: true,
          containerStyle: { width: "401px", maxWidth: "401px", height: "66px", maxHeight: "66px" },
          render: ({ onClose }) => (
            <ToastAlert status="success" borderColor="#0C824D" title="Quota Created" description="A new quota has been added." onClose={onClose} />
          ),
        });
      }
      //delete
      else if (effectiveAction === "delete") {
        await deleteQuota({ id: quotaID });
        toast({
          position: "top-right",
          duration: 5000,
          isClosable: true,
          containerStyle: { width: "401px", maxWidth: "401px", height: "66px", maxHeight: "66px" },
          render: ({ onClose }) => (
            <ToastAlert status="error" borderColor="#90080F" title="Quota Deleted" description="The quota has been deleted." onClose={onClose} />
          ),
        });
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
            userId: userInfo?.dbUser?.id ?? null,
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
    setIsLocationDifferent(false);
    setErrors({});
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
      <DrawerContent
        width="432px"
      >
        <DrawerCloseButton />
        <DrawerHeader
          padding="38px 31px 37px 30px"
          borderBottom="1px"
          borderColor="#E6E6E6"
          fontSize="23.4px"
          color="#113D64"
        >
          {currentDrawerTitle}
          <Text
            color="#586771"
            fontSize="16px"
            fontWeight="400">
              Provide information to create a new quota.
          </Text>
        </DrawerHeader>

        {isDrawerLoading ? (
          <DrawerBody padding="30px 24px 30px 24px">
          <Stack gap={4}>

            <Stack gap={2}>
              <Skeleton height="14px" width="70px" />
              <Skeleton height="40px" borderRadius="6px" />
            </Stack>

            <Flex justify="space-between" gap={4}>
              <Stack flex={1} gap={2}>
                <Skeleton height="14px" width="40px" />
                <Skeleton height="40px" borderRadius="6px" />
              </Stack>
              <Stack flex={1} gap={2}>
                <Skeleton height="14px" width="55px" />
                <Flex gap={2}>
                  <Skeleton height="40px" borderRadius="6px" flex={1} />
                  <Skeleton height="40px" borderRadius="6px" flex={1} />
                </Flex>
              </Stack>
            </Flex>

            <Flex justify="space-between" gap={4}>
              <Stack flex={1} gap={2}>
                <Skeleton height="14px" width="65px" />
                <Skeleton height="40px" borderRadius="6px" />
              </Stack>
              <Stack flex={1} gap={2}>
                <Skeleton height="14px" width="40px" />
                <Skeleton height="40px" borderRadius="6px" />
              </Stack>
            </Flex>

            <Stack gap={2}>
              <Skeleton height="14px" width="85px" />
              <Skeleton height="80px" borderRadius="6px" />
            </Stack>

            <Stack gap={2}>
              <Skeleton height="14px" width="120px" />
              <Skeleton height="120px" borderRadius="6px" />
            </Stack>

          </Stack>
        </DrawerBody>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <DrawerBody
              padding="30px 24px 30px 24px"
              >
              <Stack gap={4}>
                {isLocked && <NotificationBanner action={action} />}
                <ProviderDropdown
                  providers={providers}
                  providerId={providerId}
                  setProviderId={setProviderId}
                  isLocked={isLocked}
                  isInvalid={!!errors.providerId}
                />
                <Flex justify="space-between">
                  <DateInput
                    date={date}
                    setDate={setDate}
                    isLocked={isLocked}
                    isInvalid={!!errors.date}
                  />
                  <TimeInput
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    isLocked={isLocked}
                    isInvalid={!!errors.startTime || !!errors.endTime}
                  />
                </Flex>
                <Flex justify="space-between">
                  <LocationDropdown
                    locations={locations}
                    locationId={locationId}
                    setLocationId={setLocationId}
                    isLocked={isLocked}
                    isInvalid={!!errors.locationId}
                    onDifferentChange={setIsLocationDifferent}
                  />

                  <TypeInput
                    type={type}
                    setType={setType}
                    isLocked={isLocked}
                    isInvalid={!!errors.type}
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

            <QuotaDrawerFooter
              isLocked={isLocked}
              setIsLocked={setIsLocked}
              setAction={setAction}
              action={action}
              quotaID={quotaID}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
              isLocationDifferent={isLocationDifferent}
            />
          </form>
        )}
      </DrawerContent>
    </Drawer>
  );
}
