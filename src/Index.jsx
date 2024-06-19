import React, { useState } from 'react';
import { Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setHeaders(result.data[0]);
        setData(result.data.slice(1));
      },
      header: false,
    });
  };

  const handleAddRow = () => {
    setData([...data, Array(headers.length).fill('')]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = data.map((row, i) => 
      i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
    );
    setData(newData);
  };

  return (
    <Box p={4}>
      <Input type="file" accept=".csv" onChange={handleFileUpload} mb={4} />
      {data.length > 0 && (
        <>
          <Table variant="simple">
            <Thead>
              <Tr>
                {headers.map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <Td key={colIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      />
                    </Td>
                  ))}
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleRemoveRow(rowIndex)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleAddRow} mt={4}>
            Add Row
          </Button>
          <CSVLink data={[headers, ...data]} filename={"edited_data.csv"}>
            <Button colorScheme="blue" mt={4} ml={4}>
              Download CSV
            </Button>
          </CSVLink>
        </>
      )}
    </Box>
  );
};

export default Index;