import React from "react";

import {
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export default function ProviderTable({
  providers,
  providerCategories,
  selectedProviderId,
  onProviderSelect,
  onProviderDoubleClick,
}) {
  // sort categories by columnOrder

  const sortedCategories = [...providerCategories].sort(
    (a, b) => a.columnOrder - b.columnOrder
  );
  /**
   * Making table header by mapping categories from providerCategories
   * @returns <Thead> with each category as a cell in the header row.
   */
  const Header = () => {
    const columns = sortedCategories.map((cat) => (
      <Th key={cat.name} fontSize="sm" fontWeight="bold" color="#2D3748">{cat.name}</Th>
    ));

    return (
      <Thead
        bg="#00000014"
        h="60px"
      >
        <Tr>{columns}</Tr>
      </Thead>
    );
  };

  /**
   * Based on each category, takes data from each provider to render
   * the correct information in the respective cells.
   *
   * Will be used by Body subcomponent.
   * @returns <Tr> with each cell of necessary provider info <Td>.
   */
  const renderCellValue = (provider, cat) => {
    const raw = provider?.data?.[cat.name];

    // Special rendering for Name column: show phone + DEA below
    const catLower = cat.name.toLowerCase();
    if (catLower === "name") {
      const name = raw || "";
      // Find phone/DEA keys case-insensitively
      const dataKeys = Object.keys(provider?.data || {});
      const phoneKey = dataKeys.find((k) => k.toLowerCase() === "phone number");
      const deaKey = dataKeys.find((k) => k.toLowerCase() === "dea");
      const phone = phoneKey ? provider.data[phoneKey] : "";
      const dea = deaKey ? provider.data[deaKey] : "";

      if (!name && !phone && !dea) {
        return <Text color="gray.400"></Text>;
      }

      return (
        <>
          <Text fontWeight="medium">{name}</Text>
          {phone && (
            <Text fontSize="sm" color="gray.500">
              {phone}
            </Text>
          )}
          {dea && (
            <Text fontSize="sm" color="gray.500">
              DEA: {dea}
            </Text>
          )}
        </>
      );
    }

    // Treat undefined/null/"" as missing
    const isMissing =
      raw === undefined ||
      raw === null ||
      (typeof raw === "string" && raw.trim() === "");

    if (isMissing) {
      // Defaults per inputType
      if (cat.inputType === "tag")
        return <Text color="gray.400">NO TAGS SELECTED</Text>;
      return <Text color="gray.400"></Text>;
    }

    // Format per inputType
    if (cat.inputType === "tag") {
      // Support either array or comma-separated string
      const tags = Array.isArray(raw)
        ? raw
        : String(raw)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

      return (
        <Wrap>
          {tags.map((t) => (
            <WrapItem key={t}>
              <Tag>{t}</Tag>
            </WrapItem>
          ))}
        </Wrap>
      );
    }

    // Default rendering for text/anything else
    return String(raw);
  };

  const ProviderRow = ({ provider }) => {
    const isSelected = selectedProviderId === provider.id;

    const getCells = () =>
      providerCategories.map((cat) => (
        <Td
          key={cat.name}
          borderRight="1px solid"
          borderColor="gray.200"
        >
          {renderCellValue(provider, cat)}
        </Td>
      ));

    return (
      <Tr
        borderBottom="1px solid"
        borderColor="gray.200"
        cursor={onProviderSelect ? "pointer" : "default"}
        bg={isSelected ? "blue.50" : "transparent"}
        _hover={onProviderSelect ? { bg: isSelected ? "blue.100" : "gray.50" } : {}}
        onClick={() => onProviderSelect?.(provider)}
        onDoubleClick={() => onProviderDoubleClick?.(provider)}
      >
        {getCells()}
      </Tr>
    );
  };

  /**
   * Uses ProviderRow subcomp to display provider data.
   * @returns <Tbody> containing all rows of provider info.
   */
  const Body = () => {
    const rows = providers.map((prov) => (
      <ProviderRow
        key={prov.id}
        provider={prov}
      />
    ));
    return <Tbody>{rows}</Tbody>;
  };

  return (
    <TableContainer
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
    >
      <Table>
        {/**Subcomps to simplify structure */}
        <Header />
        <Body />
      </Table>
    </TableContainer>
  );
}
