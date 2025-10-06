import React from 'react';
import { Box, Flex, Avatar, keyframes } from '@chakra-ui/react';
import { MdLocalHospital } from 'react-icons/md';

const typing = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
`;

const TypingIndicator = () => {
  return (
    <Flex mb={4} align="flex-start" gap={3}>
      <Avatar
        size="sm"
        bg="brand.500"
        icon={<MdLocalHospital />}
        color="white"
      />
      
      <Box
        bg="white"
        px={4}
        py={3}
        borderRadius="lg"
        boxShadow="sm"
        borderBottomLeftRadius="4px"
      >
        <Flex gap={2}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="8px"
              h="8px"
              borderRadius="full"
              bg="gray.400"
              animation={`${typing} 1.4s ease-in-out infinite`}
              sx={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default TypingIndicator;

