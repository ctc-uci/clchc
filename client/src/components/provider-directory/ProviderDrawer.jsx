import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  // AlertIcon,
  Box,
  Button,
  Divider,
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
  Grid,
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
import { PiWarningCircle } from "react-icons/pi";

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
  const bannerModes = {
    create: {
      message: (
        <>
          Please confirm you would like to <strong>create</strong> a new
          provider with the following information
        </>
      ),
      primary: "#0052CE",
      bg: "#92CAFD",
    },
    edit: {
      message: (
        <>
          Please confirm you would like to <strong>save</strong> the changes to
          the provider with the following information
        </>
      ),
      primary: "#0052CE",
      bg: "#92CAFD",
    },
    delete: {
      message: (
        <>
          Please confirm you would like to <strong>delete</strong> the provider
          with the following information
        </>
      ),
      primary: "#CE0000",
      bg: "#FFD2D2",
    },
  };

  return (
    <Alert
      status="error"
      variant="subtle"
      borderRadius="8px"
      border="2px solid"
      borderColor={bannerModes[mode].primary}
      bg={bannerModes[mode].bg}
      display="flex"
      height="175px"
    >
      <Box
        display="flex"
        gap="19px"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Box
          display="flex"
          alignItems="center"
          mb={1}
          gap="10px"
        >
          <PiWarningCircle
            color={bannerModes[mode].primary}
            size={32}
          />
          <Text
            fontSize="20px"
            fontWeight={500}
            color={bannerModes[mode].primary}
          >
            Notification
          </Text>
        </Box>

        <Text
          color={bannerModes[mode].primary}
          fontSize="18px"
          fontWeight={400}
        >
          {bannerModes[mode].message}
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
      </Box>
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
      gap="20px"
    >
      <Grid
        templateColumns="repeat(2, minmax(0, 1fr))"
        gap={6}
        alignItems="end"
      >
        {categories.map((cat) => {
          return (
            <Box
              key={cat.id}
              maxW="172px"
            >
              <FormControl
                key={cat.id}
                isRequired={cat.isRequired}
                isInvalid={!!errors[cat.id]}
              >
                <FormLabel
                  color="#113D64"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight={400}
                  lineHeight="normal"
                >
                  {cat.name}
                </FormLabel>

                {cat.inputType === "text" && (
                  <Input
                    value={formValues[cat.id] || ""}
                    onChange={(e) => onChange(cat.id, e.target.value)}
                    isReadOnly={readOnly}
                    bg={readOnly ? "gray.50" : "white"}
                    color="gray.700"
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
      </Grid>
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
        toast({
          title: "Provider Deletion",
          description: "You have deleted a provider from the directory.",
          status: "error", // This is a successful delete, but the toast should be red according to Hi-Fi.
          position: "bottom-right",
          variant: "top-accent",
          duration: 5000,
          isClosable: true,
        });
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
      <DrawerContent maxW="432px">
        <DrawerCloseButton
          top="38px"
          color="#113D64"
        />
        <DrawerHeader
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "3px",
            flexShrink: 0,
            paddingTop: "38px",
          }}
        >
          <Text
            sx={{
              color: "#113D64",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "normal",
            }}
          >
            {showConfirmation && activeMode === "edit"
              ? "Confirm Changes"
              : activeMode === "create"
                ? "Create Provider"
                : activeMode === "edit"
                  ? "Edit Provider"
                  : "Delete Provider"}
          </Text>
          <Text
            sx={{
              color: "#586771",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "normal",
            }}
          >
            {activeMode === "edit"
              ? "Provider Profile"
              : "Please provide basic info about the provider."}
          </Text>
        </DrawerHeader>
        <Divider my={6} />

        {loadingTags ? (
          <SkeletonBody />
        ) : (
          <>
            <DrawerBody
              display="flex"
              flexDir="column"
              gap="32px"
              overflowX="hidden"
            >
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

            <DrawerFooter
              justifyContent="space-between"
              gap={4}
              // px={6}
            >
              {activeMode === "edit" && !showConfirmation ? (
                <>
                  <Button
<<<<<<< HEAD
                    bg="red.700"
                    color="white"
                    _hover={{ bg: "red.800" }}
=======
                    bg="#FFF"
                    color="red"
                    borderColor="#90080F"
                    borderWidth="2px"
                    _hover={{
                      bg: "#90080F",
                      color: "#FFF",
                      borderColor: "#FFF",
                    }}
>>>>>>> 1bb3079 (feat: changed button color in edit provider drawer)
                    flex={1}
                    onClick={() => {
                      setActiveMode("delete");
                      setShowConfirmation(true);
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    bg="#929292"
                    color="white"
                    _hover={{ bg: "#1a4f7a" }}
                    onClick={handleSubmit}
                    flex={1}
                  >
                    Confirm Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    flex={1}
                    color="#022442"
                    fontWeight={600}
                  >
                    Back to Editing
                  </Button>

                  <Button
                    flex={1}
                    bg={activeMode === "delete" ? "red.700" : "#113D64"}
                    color="white"
                    _hover={{
                      bg: activeMode === "delete" ? "red.800" : "#1a4f7a",
                    }}
                    onClick={handleSubmit}
                  >
                    {showConfirmation
                      ? activeMode === "delete"
                        ? "Delete"
                        : "Confirm"
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
