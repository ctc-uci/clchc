import React from "react";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
  Tag,
  Text
} from "@chakra-ui/react";

export default function ProviderTable({ providers, providerCategories }) {
  // sort categories by columnOrder
  
  const sortedCategories = [...providerCategories].sort((a, b) => a.columnOrder - b.columnOrder);
  /**
   * Making table header by mapping categories from providerCategories
   * @returns <Thead> with each category as a cell in the header row.
   */
  const Header = () => {
    const columns = sortedCategories.map((cat) => (
      <Th key={cat.name}>{cat.name}</Th>
    ));

    return (
      <Thead>
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

    // Treat undefined/null/"" as missing
    const isMissing =
      raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "");

    if (isMissing) {
      // Defaults per inputType
      if (cat.inputType === "tag") return <Text color="gray.400">NO TAGS SELECTED</Text>;
      return <Text color="gray.400">""</Text>; // default for "text" (and any other types)
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
    const getCells = () =>
      providerCategories.map((cat) => (
        <Td key={cat.name}>{renderCellValue(provider, cat)}</Td>
      ));

    return <Tr>{getCells()}</Tr>;
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
    <TableContainer>
      <Table>
        {/**Subcomps to simplify structure */}
        <Header />
        <Body />
      </Table>
    </TableContainer>
  );
}
