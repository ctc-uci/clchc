import React, { useCallback, useEffect, useState } from "react";

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
  Textarea,
  useToast,
} from "@chakra-ui/react";

import TagSelect from "@/components/provider-directory/TagSelect";
import {
  useCreateProvider,
  useDeleteProvider,
  useUpdateProvider,
} from "@/contexts/hooks/data-fetching/useProviders";
import { useTags } from "@/contexts/hooks/data-fetching/useTags";
import { errorToString } from "@/utils/utils";
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

const ConfirmationBanner = ({ mode }) => {
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
      </Box>
    </Alert>
  );
};

const ProviderFormFields = ({
  categories,
  tags,
  formValues,
  onChange,
  readOnly,
  errors,
  onDifferentChange,
}) => {
  const getTagsByCategory = useCallback(
    (categoryId) => {
      return tags.filter((tag) => tag.categoryId === categoryId);
    },
    [tags]
  );

  const fixedInputProps = {
    isReadOnly: readOnly,
    bg: readOnly ? "gray.50" : "white",
    color: "gray.700",
    display: "flex",
    w: "100%",
    padding: "5px 8px",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "2px",
    border: "1px solid var(--gray-200, #E2E8F0)",
    background: readOnly ? "var(--gray-50, #F7FAFC)" : "var(--white, #FFF)",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "normal",
  };

  const fixedLabelProps = {
    color: "#113D64",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
  };

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
        <Box w="100%">
          <FormLabel {...fixedLabelProps}>Provider Name</FormLabel>
          <Flex gap={2}>
            <FormControl
              isRequired
              isInvalid={!!errors["name"]}
            >
              <Input
                value={formValues["name"] || ""}
                onChange={(e) => onChange("name", e.target.value)}
                {...fixedInputProps}
                fontSize="12px"
              />
              {errors["name"] && (
                <Text
                  color="red.500"
                  fontSize="sm"
                  mt={1}
                >
                  {errors["name"]}
                </Text>
              )}
            </FormControl>
            <FormControl maxW="40px">
              <Input
                value={formValues["degree"] || ""}
                onChange={(e) => onChange("degree", e.target.value)}
                {...fixedInputProps}
                // fontSize="12px"
                placeholder="Deg."
                padding={"6px"}
              />
            </FormControl>
          </Flex>
        </Box>

        <Box w="100%">
          <FormControl
            isRequired
            isInvalid={!!errors["license"]}
          >
            <FormLabel {...fixedLabelProps}>NPI/License</FormLabel>
            <Input
              value={formValues["license"] || ""}
              onChange={(e) => onChange("license", e.target.value)}
              {...fixedInputProps}
            />
            {errors["license"] && (
              <Text
                color="red.500"
                fontSize="sm"
                mt={1}
              >
                {errors["license"]}
              </Text>
            )}
          </FormControl>
        </Box>

        <Box w="100%">
          <FormControl>
            <FormLabel {...fixedLabelProps}>DEA</FormLabel>
            <Input
              value={formValues["dea"] || ""}
              onChange={(e) => onChange("dea", e.target.value)}
              {...fixedInputProps}
            />
          </FormControl>
        </Box>

        <Box w="100%">
          <FormControl>
            <FormLabel {...fixedLabelProps}>Phone Number</FormLabel>
            <Input
              value={formValues["phoneNumber"] || ""}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              {...fixedInputProps}
            />
          </FormControl>
        </Box>
      </Grid>

      <Grid
        templateColumns="repeat(2, minmax(0, 1fr))"
        gap={6}
        alignItems="end"
      >
        {categories.map((cat) => {
          return (
            <Box
              key={cat.id}
              w="100%"
            >
              <FormControl
                key={cat.id}
                isRequired={cat.isRequired}
                isInvalid={!!errors[cat.id]}
              >
                <FormLabel
                  color="#113D64"
                  fontFamily={"Inter"}
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
                    display={"flex"}
                    // minW={"100px"}
                    w={"100%"}
                    // minH={"30x"}
                    padding={"5px 10px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={"10px"}
                    borderRadius={"2px"}
                    border={"1px solid var(--gray-200, #E2E8F0)"}
                    background={"var(--white, #FFF);"}
                    fontFamily={"Lato"}
                    fontStyle={"normal"}
                    fontSize={"14px"}
                    fontWeight={"400"}
                    lineHeight={"normal"}
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
                    onDifferentChange={onDifferentChange}
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

      <FormControl>
        <FormLabel {...fixedLabelProps}>Long Term Notes</FormLabel>
        <Textarea
          value={formValues["notes"] || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          isReadOnly={readOnly}
          bg={readOnly ? "gray.50" : "white"}
          fontFamily="Lato"
          fontSize="14px"
          fontWeight="400"
          color="gray.700"
          borderRadius="6px"
          border="1px solid var(--gray-200, #E2E8F0)"
          background="var(--white, #FFF)"
          resize="vertical"
          rows={4}
          h={"80px"}
        />
      </FormControl>
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
  const [isTagDifferent, setIsTagDifferent] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const {
    data: tagsData,
    isLoading: loadingTags,
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
          const converted = {
            name: provider.name ?? "",
            degree: provider.degree ?? "",
            license: provider.license ?? "",
            dea: provider.dea ?? "",
            phoneNumber: provider.phoneNumber ?? "",
            notes: provider.notes ?? "",
          };

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
    setIsTagDifferent(false);
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
      name: formState.name || "",
      degree: formState.degree || "",
      license: formState.license || "",
      dea: formState.dea || "",
      phoneNumber: formState.phoneNumber || "",
      data: dataPayload,
      notes: formState.notes || "",
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
        await createProvider(buildPayload());
      } else if (activeMode === "edit") {
        await updateProvider({
          id: provider.id,
          providerData: buildPayload(),
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
    setIsTagDifferent(false);
    setActiveMode(mode);
    setFormValues({});
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues["name"] || formValues["name"].trim() === "") {
      newErrors["name"] = "Name is required";
    }

    if (!formValues["license"] || formValues["license"].trim() === "") {
      newErrors["license"] = "NPI/License is required";
    }

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
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent w="432px">
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
                  ? (provider?.name ?? "Edit Provider")
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
              : activeMode === "delete"
                ? "Please confirm you would like to delete this provider."
                : "Please provide basic info about the provider."}
          </Text>
        </DrawerHeader>
        <Divider my={6} />

        {loadingTags ? (
          <SkeletonBody />
        ) : (
          <>
            <DrawerBody
              flexDir="column"
              gap="32px"
              overflowX="hidden"
            >
              {showConfirmation && (
                <Box mb={4}>
                  <ConfirmationBanner
                    mode={activeMode}
                  />
                </Box>
              )}

              <ProviderFormFields
                categories={categories}
                tags={tags}
                formValues={formValues}
                onChange={handleChange}
                readOnly={isReadOnly}
                errors={errors}
                onDifferentChange={setIsTagDifferent}
              />
            </DrawerBody>

            <DrawerFooter
              justifyContent="space-between"
              gap="20px"
              w="100%"
              bg="white"
              borderTop="1px solid"
              borderColor="gray.200"
            >
              {activeMode === "edit" && !showConfirmation ? (
                <>
                  <Button
                    variant="outline"
                    color="#90080F"
                    borderColor="#90080F"
                    _hover={{ bg: "red.800", color: "#FFF" }}
                    onClick={() => {
                      setActiveMode("delete");
                      setShowConfirmation(true);
                    }}
                    borderRadius="4px"
                    width="50%"
                    fontFamily="Inter"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="28px"
                    padding="10px"
                  >
                    Delete
                  </Button>

                  <Button
                    bg="#929292"
                    color="white"
                    _hover={{ bg: "#1a4f7a" }}
                    onClick={handleSubmit}
                    isDisabled={activeMode !== "delete" && isTagDifferent}
                    borderRadius="4px"
                    width="50%"
                    fontFamily="Inter"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="28px"
                    padding="10px"
                  >
                    Confirm Changes
                  </Button>
                </>
              ) : activeMode === "create" && !showConfirmation ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    color="#022442"
                    borderColor="#0000003D"
                    _hover={{ bg: "gray.100" }}
                    borderRadius="4px"
                    width="50%"
                    fontFamily="Inter"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="28px"
                    padding="10px"
                  >
                    Cancel
                  </Button>

                  <Button
                    bg="#929292"
                    color="white"
                    _hover={{ bg: "#1a4f7a" }}
                    onClick={handleSubmit}
                    isDisabled={isTagDifferent}
                    borderRadius="4px"
                    width="50%"
                    fontFamily="Inter"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="28px"
                    padding="10px"
                  >
                    Create
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConfirmation(false);
                      if (activeMode === "delete") setActiveMode("edit");
                    }}
                    color="#022442"
                    borderColor="#0000003D"
                    borderRadius="4px"
                    width="50%"
                    fontFamily="Inter"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="28px"
                    padding="10px"
                  >
                    Back to Editing
                  </Button>

                  <Button
                    bg={activeMode === "delete" ? "red.700" : "#113D64"}
                    color="white"
                    _hover={{
                      bg: activeMode === "delete" ? "red.800" : "#1a4f7a",
                    }}
                    onClick={handleSubmit}
                    isDisabled={isTagDifferent}
                    borderRadius="4px"
                    width="50%"
                    fontFamily="Inter"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="28px"
                    padding="10px"
                  >
                    {activeMode === "delete" ? "Delete" : "Confirm"}
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
