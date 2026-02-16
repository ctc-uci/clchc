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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

// --- Confirmation Banner ---
const ConfirmationBanner = ({ mode }) => {
  const messages = {
    create:
      "Please confirm you would like to create a new provider with the following information",
    edit: 
      "Please confirm you would like to save the changes to the provider with the following information",
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
//We're not using these functions right now, but they could be helpful for formatting specific fields in the future
// Maps a display label to the actual DB category name (case-insensitive match)
// const findCategoryName = (categories, label) => {
//   const lower = label.toLowerCase();
//   const match = categories.find((c) => c.name.toLowerCase() === lower);
//   return match ? match.name : label;
// };

// // Format phone: (XXX) XXX - XXXX
// const formatPhone = (value) => {
//   const digits = value.replace(/\D/g, "").slice(0, 10);
//   if (digits.length === 0) return "";
//   if (digits.length <= 3) return `(${digits}`;
//   if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
//   return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} - ${digits.slice(6)}`;
// };

// // Format license/NPI: XXX XXXXX XXXXXXXXXX (3 + 5 + rest, alphanumeric)
// const formatLicenseNpi = (value) => {
//   const clean = value.replace(/[^a-zA-Z0-9]/g, "");
//   if (clean.length <= 3) return clean;
//   if (clean.length <= 8) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
//   return `${clean.slice(0, 3)} ${clean.slice(3, 8)} ${clean.slice(8)}`;
// };

// --- Provider Form Fields (hardcoded 2-column layout matching MidFi) ---
// `catNames` maps display labels to actual DB category names
const ProviderFormFields = ({ categories, tags, formValues, onChange, readOnly, errors}) => {
  // const fieldProps = (displayLabel) => {
  //   const key = catNames[displayLabel] || displayLabel;
  //   return {
  //     value: formValues[key] || "",
  //     onChange: (e) => onChange(key, e.target.value),
  //     isReadOnly: readOnly,
  //     bg: readOnly ? "gray.50" : "white",
  //   };
  // };

  // const formattedFieldProps = (displayLabel, formatter) => {
  //   const key = catNames[displayLabel] || displayLabel;
  //   return {
  //     value: formValues[key] || "",
  //     onChange: (e) => onChange(key, formatter(e.target.value)),
  //     isReadOnly: readOnly,
  //     bg: readOnly ? "gray.50" : "white",
  //   };
  // };

  // const selectProps = (displayLabel) => {
  //   const key = catNames[displayLabel] || displayLabel;
  //   return {
  //     value: formValues[key] || "",
  //     onChange: (e) => onChange(key, e.target.value),
  //     isDisabled: readOnly,
  //     bg: readOnly ? "gray.50" : "white",
  //   };
  // };

return (
    <Flex direction="column" gap={6}>
      <Flex wrap="wrap" gap={6}>
        {console.log(categories)}
        {categories.map((cat) => {

          return (
            <Box key={cat.id} flex="1 1 48%">
              <FormControl
                key={cat.id}
                mb={4}
                isRequired={cat.is_required}
                isInvalid={!!errors[cat.id]}
              >
                <FormLabel fontWeight={600}>
                  {cat.name}
                </FormLabel>

                {cat.inputType === "text" && (
                  <Input
                    value={formValues[cat.id] || ""}
                    onChange={(e) => onChange(cat.id, e.target.value)}
                    isReadOnly={readOnly}
                    bg={readOnly ? "gray.50" : "white"}
                  />
                )}

                {cat.inputType === "tag" && (
                  <Select
                    placeholder="Select"
                    value={formValues[cat.id] || ""}
                    onChange={(e) => onChange(cat.id, e.target.value)}
                    isDisabled={readOnly}
                    bg={readOnly ? "gray.50" : "white"}
                  >
                    {tags
                      .filter((tag) => tag.categoryId === cat.id)
                      .map((tag) => (
                        <option key={tag.id} value={tag.tagValue}>
                          {tag.tagValue}
                        </option>
                      ))}
                  </Select>
                )}


                {errors[cat.id] && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors[cat.id]}
                  </Text>
                )}
              </FormControl>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
};

// --- Main ProviderDrawer ---
const ProviderDrawer = ({ mode, provider, isOpen, onClose, onSaved }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const { backend } = useBackendContext();
  const [activeMode, setActiveMode] = useState(mode);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setActiveMode(mode);

    const init = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          backend.get("/directoryCategories"),
          backend.get("/tags"),
        ]);

        setCategories(catRes.data);
        setTags(tagRes.data);

        if ((mode === "edit" || mode === "delete") && provider) {
          const converted = {};

          catRes.data.forEach((cat) => {
            const existingValue = provider.data?.[cat.name];

            if (existingValue !== undefined) {
              converted[cat.id] = existingValue;
            }
          });

          setFormValues(converted);
        }

      } catch (err) {
        console.error("Error fetching drawer data", err);
      }
    };

    init();
    setShowConfirmation(false);
  }, [isOpen, backend, mode, provider]);


  const handleChange = (categoryId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const buildPayload = () => {
    const dataPayload = {};

    categories.forEach((cat) => {
      if (formValues[cat.id] !== undefined) {
        dataPayload[cat.name] = formValues[cat.id];
      }
    });

    return {
      data: dataPayload,
      note: formValues.note || "",
    };
  };


  const handleSubmit = async () => {
    if (!showConfirmation) {
      const isValid = validateForm();

      if (!isValid) return;

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

  const validateForm = () => {
  const newErrors = {};

  categories.forEach((cat) => {
    if (cat.is_required) {
      const value = formValues[cat.id];

      const isEmpty =
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        newErrors[cat.id] = `${cat.name} is required`;
      }
    }
  });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            : activeMode === "create"
            ? "Create Provider"
            : activeMode === "edit"
            ? "Edit Provider"
            : "Delete Provider"}
        </DrawerHeader>

        <DrawerBody>
          {showConfirmation && <ConfirmationBanner mode={activeMode} />}

          <ProviderFormFields
            categories={categories}
            tags={tags}
            formValues={formValues}
            onChange={handleChange}
            readOnly={isReadOnly}
            errors={errors}
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
                Save Changes
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
                _hover={{
                  bg: activeMode === "delete" ? "red.700" : "gray.800",
                }}
                onClick={handleSubmit}
              >
                {showConfirmation ? "Confirm" : activeMode === "create" ? "Create" : "Confirm"}
              </Button>
            </>
          )}
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  );
};

export default ProviderDrawer;
