import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Button, Text, Spinner } from '@chakra-ui/react';
import { MdLightbulb } from 'react-icons/md';
import { getSampleQueries } from '../utils/api';

const SampleQueries = ({ onSelectQuery }) => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const queries = await getSampleQueries();
        setSamples(queries);
      } catch (error) {
        console.error('Error loading samples:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  return (
    <Box>
      <Heading size="sm" mb={4} display="flex" alignItems="center" gap={2}>
        <MdLightbulb />
        Sample Queries
      </Heading>
      
      {loading ? (
        <Box textAlign="center" py={6}>
          <Spinner size="sm" />
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {samples.map((query, index) => (
          <Button
            key={index}
            size="sm"
            variant="outline"
            textAlign="left"
            whiteSpace="normal"
            height="auto"
            py={3}
            px={4}
            onClick={() => onSelectQuery(query)}
            _hover={{
              bg: 'brand.500',
              color: 'white',
              borderColor: 'brand.500',
              transform: 'translateX(4px)',
            }}
            transition="all 0.2s"
          >
            <Text fontSize="sm">{query}</Text>
          </Button>
          ))}
        </VStack>
      )}

      <Box mt={6} pt={6} borderTop="1px" borderColor="gray.200">
        <Heading size="xs" mb={3}>
          ℹ️ About
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={3}>
          This assistant helps healthcare professionals analyze patient
          healthcare journeys using real-world healthcare data.
        </Text>
        <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
          <Text>✓ Patient enrollment data</Text>
          <Text>✓ Medical claims analysis</Text>
          <Text>✓ Pharmacy claims tracking</Text>
          <Text>✓ Diagnosis codes</Text>
          <Text>✓ Procedure information</Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default SampleQueries;

