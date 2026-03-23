import {
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  Select,
  Skeleton,
} from "@chakra-ui/react";

import { useProvidersSummary } from "@/contexts/hooks/data-fetching/useProviders";

import { selectStyles } from "../tools//constants";
import { LockRightElement } from "../tools/shared";

export function ProviderDropdown({ providerId, setProviderId, isLocked }) {
  const { data: providers = [], isLoading: loadingSummary } =
    useProvidersSummary();

  if (loadingSummary) {
    return (
      <>
        <Skeleton
          height="16px"
          mb={2}
        />
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
