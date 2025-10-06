import React, { useEffect, useState } from 'react';
import { Flex, Text, Box, keyframes } from '@chakra-ui/react';
import { checkAgentHealth } from '../utils/api';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const StatusBadge = () => {
  const [status, setStatus] = useState({
    status: 'checking',
    message: 'Checking...',
  });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const result = await checkAgentHealth();
      setStatus(result);
    } catch (error) {
      setStatus({
        status: 'error',
        message: 'Connection error',
      });
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'healthy':
        return 'green.400';
      case 'unconfigured':
      case 'checking':
        return 'yellow.400';
      case 'error':
        return 'red.400';
      default:
        return 'gray.400';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'healthy':
        return 'Connected';
      case 'unconfigured':
        return 'Not Configured';
      case 'checking':
        return 'Checking...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <Flex
      align="center"
      gap={2}
      bg="whiteAlpha.200"
      px={4}
      py={2}
      borderRadius="md"
      backdropFilter="blur(10px)"
    >
      <Box
        w="10px"
        h="10px"
        borderRadius="full"
        bg={getStatusColor()}
        animation={
          status.status === 'checking' ? `${pulse} 2s ease-in-out infinite` : 'none'
        }
      />
      <Text fontSize="sm" fontWeight="medium" color="white">
        {getStatusText()}
      </Text>
    </Flex>
  );
};

export default StatusBadge;

