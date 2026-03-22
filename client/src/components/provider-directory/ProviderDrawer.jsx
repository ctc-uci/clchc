import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  Flex,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useApi } from "@/api.js";
import TagSelect from "@/components/provider-directory/TagSelect";
import {
  useCreateProvider,
  useDeleteProvider,
  useUpdateProvider,
} from "@/contexts/hooks/data-fetching/useProviders";
import { useTags } from "@/contexts/hooks/data-fetching/useTags";
import { errorToString } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";

const SkeletonBody = () => {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton
          key={i}
          height="15%"
          margin="20px"
        />
      ))}
    </>
  );
};

const ConfirmationBanner = ({ mode, pendingTagDeletes = [] }) => {
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
      <Box
        display="flex"
        alignItems="center"
        mb={1}
      >
        <AlertIcon
          color="red.500"
          mr={2}
        />
        <Text
          fontWeight="bold"
          color="red.500"
        >
          Notification
        </Text>
      </Box>
      <Text
        color="red.500"
        fontSize="sm"
      >
        {messages[mode]}
      </Text>
      {pendingTagDeletes.length > 0 && (
        <Text
          color="red.600"
          fontSize="sm"
          mt={2}
        >
          {pendingTagDeletes.length} tag(s) will be deleted:{" "}
          {pendingTagDeletes.map((t) => t.tagValue).join(", ")}. This will
          remove them from all providers.
        </Text>
      )}
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
const ProviderFormFields = ({
  categories,
  tags,
  formValues,
  onChange,
  readOnly,
  errors,
  onRequestDeleteTag,
  pendingTagDeletes = [],
}) => {
  const pendingTagDeleteIds = useMemo(
    () => new Set(pendingTagDeletes.map((t) => t.id)),
    [pendingTagDeletes]
  );

  const getTagsByCategory = useCallback(
    (categoryId) => {
      return tags.filter(
        (tag) =>
          tag.categoryId === categoryId && !pendingTagDeleteIds.has(tag.id)
      );
    },
    [tags, pendingTagDeleteIds]
  );

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
    <Flex
      direction="column"
      gap={6}
    >
      <Flex
        wrap="wrap"
        gap={6}
      >
        {categories.map((cat) => {
          return (
            <Box
              key={cat.id}
              flex="1 1 48%"
            >
              <FormControl
                key={cat.id}
                mb={4}
                isRequired={cat.isRequired}
                isInvalid={!!errors[cat.id]}
              >
                <FormLabel fontWeight={600}>{cat.name}</FormLabel>

                {cat.inputType === "text" && (
                  <Input
                    value={formValues[cat.id] || ""}
                    onChange={(e) => onChange(cat.id, e.target.value)}
                    isReadOnly={readOnly}
                    bg={readOnly ? "gray.50" : "white"}
                  />
                )}

                {cat.inputType === "tag" && (
                  <TagSelect
                    key={cat.id}
                    categoryId={cat.id}
                    tags={getTagsByCategory(cat.id)}
                    selectedTags={formValues[cat.id] || []}
                    onTagsChange={(value) => {
                      onChange(cat.id, value);
                    }}
                    readOnly={readOnly}
                    onRequestDeleteTag={onRequestDeleteTag}
                  />
                )}

                {errors[cat.id] && (
                  <Text
                    color="red.500"
                    fontSize="sm"
                    mt={1}
                  >
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
const ProviderDrawer = ({
  mode,
  provider,
  categories,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [activeMode, setActiveMode] = useState(mode);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTagDeletes, setPendingTagDeletes] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  const toast = useToast();
  const { tags: tagsApi } = useApi();
  const {
    data: tagsData,
    isLoading: loadingTags,
    refetch: refetchTags,
  } = useTags();
  const tags = tagsData?.tags ?? [];
  const { mutateAsync: createProvider } = useCreateProvider();
  const { mutateAsync: updateProvider } = useUpdateProvider();
  const { mutateAsync: deleteProvider } = useDeleteProvider();

  useEffect(() => {
    if (!isOpen) return;

    setActiveMode(mode);

    const init = async () => {
      try {
        if ((mode === "edit" || mode === "delete") && provider) {
          const converted = {};

          categories.forEach((cat) => {
            const existingValue = provider.data?.[cat.name];

            if (existingValue === undefined) {
              return;
            }

            if (cat.inputType === "tag") {
              const tagArr = Array.isArray(existingValue)
                ? existingValue
                : [existingValue];
              converted[cat.id] = tagArr;
            } else {
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
    setPendingTagDeletes([]);
  }, [isOpen, mode, provider, categories]);

  const handleChange = (categoryId, value) => {
    const cat = categories.find((c) => c.id === categoryId);
    const sanitized =
      cat?.inputType === "tag" && Array.isArray(value)
        ? value.filter((id) => id !== null && id !== "")
        : value;

    setFormValues((prev) => ({
      ...prev,
      [categoryId]: sanitized,
    }));
  };

  const buildPayload = (formState = formValues) => {
    const dataPayload = {};

    categories.forEach((cat) => {
      if (formState[cat.id] !== undefined) {
        dataPayload[cat.name] = formState[cat.id];
      }
    });

    return {
      data: dataPayload,
      note: formState.note || "",
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
      // remove staged tag ids from form state so payload doesn't include them
      const idsToRemove = new Set(pendingTagDeletes.map((t) => t.id));
      const formValuesAfterTagDeletes = { ...formValues };
      categories.forEach((cat) => {
        if (
          cat.inputType === "tag" &&
          Array.isArray(formValuesAfterTagDeletes[cat.id])
        ) {
          formValuesAfterTagDeletes[cat.id] = formValuesAfterTagDeletes[
            cat.id
          ].filter((id) => !idsToRemove.has(id));
        }
      });

      // confirmation, delete staged tags
      for (const { id } of pendingTagDeletes) {
        await tagsApi.delete(id);
      }
      if (pendingTagDeletes.length > 0) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            ["providers", "providersSummary", "tags"].includes(
              query.queryKey[0]
            ),
        });
        if (typeof refetchTags === "function") await refetchTags();
        setFormValues(formValuesAfterTagDeletes);
        setPendingTagDeletes([]);
      }

      if (activeMode === "create") {
        await createProvider(buildPayload(formValuesAfterTagDeletes));
      } else if (activeMode === "edit") {
        await updateProvider({
          id: provider.id,
          providerData: buildPayload(formValuesAfterTagDeletes),
        });
      } else if (activeMode === "delete") {
        await deleteProvider(provider.id);
      }

      handleClose();
      if (typeof onSaved === "function") onSaved();
    } catch (err) {
      console.error(`Failed to ${activeMode} provider`, err);
      toast({
        title: "Error",
        description: errorToString(err),
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setPendingTagDeletes([]);
    setActiveMode(mode);
    setFormValues({});
    onClose();
  };

  const handleRequestDeleteTag = useCallback((tag) => {
    setPendingTagDeletes((prev) => {
      const hasTagId = prev.some((t) => t.id === tag.id);
      if (hasTagId) return prev;
      return [...prev, tag];
    });
    // optimistic
    if (tag.categoryId !== undefined && tag.categoryId !== null) {
      setFormValues((prev) => ({
        ...prev,
        [tag.categoryId]: (prev[tag.categoryId] || []).filter(
          (id) => id !== tag.id
        ),
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    categories.forEach((cat) => {
      if (cat.isRequired) {
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
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={handleClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          fontWeight="bold"
          fontSize="xl"
        >
          {showConfirmation && activeMode === "edit"
            ? "Confirm Changes"
            : activeMode === "create"
              ? "Create Provider"
              : activeMode === "edit"
                ? "Edit Provider"
                : "Delete Provider"}
        </DrawerHeader>
        {loadingTags ? (
          <SkeletonBody />
        ) : (
          <>
            <DrawerBody>
              {showConfirmation && (
                <ConfirmationBanner
                  mode={activeMode}
                  pendingTagDeletes={pendingTagDeletes}
                />
              )}

              <ProviderFormFields
                categories={categories}
                tags={tags}
                formValues={formValues}
                onChange={handleChange}
                readOnly={isReadOnly}
                errors={errors}
                onRequestDeleteTag={handleRequestDeleteTag}
                pendingTagDeletes={pendingTagDeletes}
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
                  <Button
                    variant="outline"
                    onClick={handleClose}
                  >
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
                    {showConfirmation
                      ? "Confirm"
                      : activeMode === "create"
                        ? "Create"
                        : "Confirm"}
                  </Button>
                </>
              )}
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ProviderDrawer;
