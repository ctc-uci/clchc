import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

// --- Confirmation Banner ---
const ConfirmationBanner = ({ mode }) => {
  const messages = {
    create:
      "Please confirm you would like to create a new provider with the following information",
    edit: "Please confirm you would like to save the changes to the provider with the following information",
    delete:
      "Please confirm you would like to delete the provider with the following information",
  };

  return (
    <Alert
      status="error"
      variant="subtle"
      borderRadius="md"
      border="1px solid"
      borderColor="red.200"
      bg="red.50"
      flexDirection="column"
      alignItems="flex-start"
      p={4}
      mb={4}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <AlertIcon color="red.500" mr={2} />
        <Text fontWeight="bold" color="red.500">
          Notification
        </Text>
      </Box>
      <Text color="red.500" fontSize="sm">
        {messages[mode]}
      </Text>
    </Alert>
  );
};

// Maps a display label to the actual DB category name (case-insensitive match)
const findCategoryName = (categories, label) => {
  const lower = label.toLowerCase();
  const match = categories.find((c) => c.name.toLowerCase() === lower);
  return match ? match.name : label;
};

// Format phone: (XXX) XXX - XXXX
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} - ${digits.slice(6)}`;
};

// Format license/NPI: XXX XXXXX XXXXXXXXXX (3 + 5 + rest, alphanumeric)
const formatLicenseNpi = (value) => {
  const clean = value.replace(/[^a-zA-Z0-9]/g, "");
  if (clean.length <= 3) return clean;
  if (clean.length <= 8) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `${clean.slice(0, 3)} ${clean.slice(3, 8)} ${clean.slice(8)}`;
};

// --- Provider Form Fields (hardcoded 2-column layout matching MidFi) ---
// `catNames` maps display labels to actual DB category names
const ProviderFormFields = ({ formValues, onChange, readOnly, catNames }) => {
  const fieldProps = (displayLabel) => {
    const key = catNames[displayLabel] || displayLabel;
    return {
      value: formValues[key] || "",
      onChange: (e) => onChange(key, e.target.value),
      isReadOnly: readOnly,
      bg: readOnly ? "gray.50" : "white",
    };
  };

  const formattedFieldProps = (displayLabel, formatter) => {
    const key = catNames[displayLabel] || displayLabel;
    return {
      value: formValues[key] || "",
      onChange: (e) => onChange(key, formatter(e.target.value)),
      isReadOnly: readOnly,
      bg: readOnly ? "gray.50" : "white",
    };
  };

  const selectProps = (displayLabel) => {
    const key = catNames[displayLabel] || displayLabel;
    return {
      value: formValues[key] || "",
      onChange: (e) => onChange(key, e.target.value),
      isDisabled: readOnly,
      bg: readOnly ? "gray.50" : "white",
    };
  };

  return (
    <>
      {/* Row 1: Provider Name + NPI/License */}
      <Flex gap={4} mb={4}>
        <FormControl flex={1}>
          <FormLabel fontWeight={600}>Provider Name</FormLabel>
          <Flex gap={2}>
            <Input placeholder="John Smith" {...fieldProps("Name")} flex={1} />
            <Input placeholder="PA" {...fieldProps("Credential")} w="60px" />
          </Flex>
        </FormControl>
        <FormControl flex={1}>
          <FormLabel fontWeight={600}>License / NPI</FormLabel>
          <Input
            placeholder="XXX XXXXX XXXXXXXXX"
            {...formattedFieldProps("NPI/License", formatLicenseNpi)}
          />
        </FormControl>
      </Flex>

      {/* Row 2: Phone Number + DEA */}
      <Flex gap={4} mb={4}>
        <FormControl flex={1}>
          <FormLabel fontWeight={600}>Phone Number</FormLabel>
          <Input
            placeholder="(000) 000 - 0000"
            {...formattedFieldProps("Phone Number", formatPhone)}
          />
        </FormControl>
        <FormControl flex={1}>
          <FormLabel fontWeight={600}>DEA</FormLabel>
          <Input placeholder="XX000000000" {...fieldProps("DEA")} />
        </FormControl>
      </Flex>

      {/* Row 3: Patients + MAT Program */}
      <Flex gap={4} mb={4}>
        <FormControl flex={1}>
          <FormLabel fontWeight={600}>Patients</FormLabel>
          <Select placeholder="Select" {...selectProps("Patients")}>
            <option value="No">No</option>
            <option value="5+ Children">5+ Children</option>
            <option value="21+ Adults">21+ Adults</option>
            <option value="18+ Adults">18+ Adults</option>
          </Select>
        </FormControl>
        <FormControl flex={1}>
          <FormLabel fontWeight={600}>MAT Program</FormLabel>
          <Select placeholder="Select" {...selectProps("MAT Program")}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormControl>
      </Flex>

      {/* Row 4: Languages (full width) */}
      <FormControl mb={4}>
        <FormLabel fontWeight={600}>Languages</FormLabel>
        <Select placeholder="Select" {...selectProps("Languages")}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="Korean">Korean</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Mandarin">Mandarin</option>
          <option value="Tagalog">Tagalog</option>
        </Select>
      </FormControl>

      {/* Row 5: Long Term Notes (full width) */}
      <FormControl mb={4}>
        <FormLabel fontWeight={600}>Long Term Notes</FormLabel>
        <Textarea
          placeholder="Type long term note here..."
          value={formValues[catNames["Long Term Notes"] || "Long Term Notes"] || ""}
          onChange={(e) =>
            onChange(catNames["Long Term Notes"] || "Long Term Notes", e.target.value)
          }
          isReadOnly={readOnly}
          bg={readOnly ? "gray.50" : "white"}
          resize="vertical"
          minH="120px"
        />
      </FormControl>
    </>
  );
};

// Display labels we use in the form — matched case-insensitively to DB categories
const FORM_LABELS = [
  "Name",
  "Credential",
  "NPI/License",
  "Phone Number",
  "DEA",
  "Patients",
  "MAT Program",
  "Languages",
  "Long Term Notes",
];

// --- Main ProviderDrawer ---
const ProviderDrawer = ({ mode, provider, isOpen, onClose, onSaved }) => {
  const { backend } = useBackendContext();
  const [activeMode, setActiveMode] = useState(mode);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [catNames, setCatNames] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setActiveMode(mode);

    const init = async () => {
      try {
        const res = await backend.get("/directoryCategories");
        const categories = res.data;

        // Build mapping: display label -> actual DB category name
        const mapping = {};
        FORM_LABELS.forEach((label) => {
          mapping[label] = findCategoryName(categories, label);
        });
        setCatNames(mapping);

        // Pre-fill form for edit/delete
        if ((mode === "edit" || mode === "delete") && provider) {
          setFormValues({
            ...provider.data,
            [mapping["Long Term Notes"]]: provider.data?.[mapping["Long Term Notes"]] || provider.note || "",
          });
        } else {
          setFormValues({});
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    init();
    setShowConfirmation(false);
  }, [isOpen, backend, mode, provider]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => {
    const noteKey = catNames["Long Term Notes"] || "Long Term Notes";
    const note = formValues[noteKey] || "";
    return { data: { ...formValues }, note };
  };

  const handleSubmit = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      if (activeMode === "create") {
        await backend.post("/providers", buildPayload());
      } else if (activeMode === "edit") {
        await backend.put(`/providers/${provider.id}`, buildPayload());
      } else if (activeMode === "delete") {
        await backend.delete(`/providers/${provider.id}`);
      }

      handleClose();
      if (typeof onSaved === "function") onSaved();
    } catch (err) {
      console.error(`Failed to ${activeMode} provider`, err);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setActiveMode(mode);
    setFormValues({});
    onClose();
  };

  const titles = {
    create: "Create Provider",
    edit: "Edit Provider",
    delete: "Delete Provider",
  };

  const submitLabels = {
    create: "Create",
    edit: "Save Changes",
    delete: "Confirm",
  };

  const isReadOnly = showConfirmation || activeMode === "delete";

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={handleClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="bold" fontSize="xl">
          {showConfirmation && activeMode === "edit"
            ? "Confirm Changes"
            : titles[activeMode]}
        </DrawerHeader>

        <DrawerBody>
          {showConfirmation && <ConfirmationBanner mode={activeMode} />}

          <ProviderFormFields
            formValues={formValues}
            onChange={handleChange}
            readOnly={isReadOnly}
            catNames={catNames}
          />
        </DrawerBody>

        <DrawerFooter justifyContent="space-between">
          {activeMode === "edit" && !showConfirmation ? (
            <>
              <Button
                bg="red.600"
                color="white"
                _hover={{ bg: "red.700" }}
                onClick={() => {
                  setActiveMode("delete");
                  setShowConfirmation(true);
                }}
              >
                Delete Provider
              </Button>
              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                onClick={handleSubmit}
              >
                {submitLabels[activeMode]}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                bg={activeMode === "delete" ? "red.600" : "black"}
                color="white"
                _hover={{ bg: activeMode === "delete" ? "red.700" : "gray.800" }}
                onClick={handleSubmit}
              >
                {showConfirmation ? "Confirm" : submitLabels[activeMode]}
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProviderDrawer;
