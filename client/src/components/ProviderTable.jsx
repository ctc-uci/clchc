import React from "react";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export default function ProviderTable({ providers, providerCategories }) {
  /**
   * Making table header by mapping categories from providerCategories
   * @returns <Thead> with each category as a cell in the header row.
   */
  const Header = () => {
    const columns = providerCategories.map((cat) => (
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
  const ProviderRow = ({ provider }) => {
    const getCells = () =>
      providerCategories.map((cat) => (
        <Td key={cat.name}>{provider.data[cat.name]}</Td>
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
