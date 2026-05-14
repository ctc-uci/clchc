import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

import CustomSelect from "@/components/common/CustomSelect";

export function ProviderDropdown({ providers = [], providerId, setProviderId, isLocked, isInvalid }) {
  const options = providers.map((p) => ({ value: String(p.id), label: p.name }));

  const fixedInputProps = {
    color: "gray.700",
    display: "flex",
    w: "100%",
    padding: "5px 8px",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "4px",
    border: isInvalid ? "1px solid #FC8181" : "1px solid var(--gray-200, #E2E8F0)",
    background: "var(--white, #FFF)",
    fontStyle: "normal",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "normal",
  };

  return (
    <FormControl
      isRequired
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Provider
      </FormLabel>
      <CustomSelect
        options={options}
        value={String(providerId ?? "")}
        setValue={setProviderId}
        isSearchable
        isReadOnly={isLocked}
        placeholder="Select provider"
        styleProps={fixedInputProps}
      />
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
}
