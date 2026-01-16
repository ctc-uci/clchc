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
  console.log(providers);
  console.log(providerCategories);

  const Header = () => {
    const columns = providerCategories.map((category) => (
      <Th key={category.name}>{category.name}</Th>
    ));

    return (
      <Thead>
        <Tr>{columns}</Tr>
      </Thead>
    );
  };

  const Body = () => (
    <Tbody>
      {providers?.map((provider) => (
        <Tr key={provider.id}>

          {providerCategories.map((category) => (
            <Td key={category.id}>{provider.data[category.name] ?? ""}</Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  );

  return (
    <TableContainer>
      <Table>
        <Header />
        <Body />
      </Table>
    </TableContainer>
  );
}
