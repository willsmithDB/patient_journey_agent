import React from 'react';
import { Box, Flex, Text, Avatar } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';

const ChatMessage = ({ message, isUser }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Flex
      mb={4}
      justify={isUser ? 'flex-end' : 'flex-start'}
      align="flex-start"
      direction={isUser ? 'row-reverse' : 'row'}
      gap={3}
    >
      <Avatar
        size="sm"
        bg={isUser ? 'purple.500' : 'brand.500'}
        icon={isUser ? <FiUser /> : <MdLocalHospital />}
        color="white"
      />
      
      <Box maxW="70%">
        <Box
          bg={isUser ? 'purple.500' : 'white'}
          color={isUser ? 'white' : 'gray.800'}
          px={4}
          py={3}
          borderRadius="lg"
          boxShadow="sm"
          borderBottomRightRadius={isUser ? '4px' : 'lg'}
          borderBottomLeftRadius={isUser ? 'lg' : '4px'}
        >
          <Text
            fontSize="md"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            dangerouslySetInnerHTML={{
              __html: formatMessage(message.content),
            }}
          />
        </Box>
        <Text
          fontSize="xs"
          color="gray.500"
          mt={1}
          textAlign={isUser ? 'right' : 'left'}
        >
          {formatTime(message.timestamp)}
        </Text>
      </Box>
    </Flex>
  );
};

// Format message content with basic markdown-like formatting
const formatMessage = (content) => {
  let formatted = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Format code blocks
  formatted = formatted.replace(
    /```([\s\S]*?)```/g,
    '<pre style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0; overflow-x: auto;"><code>$1</code></pre>'
  );

  // Format inline code
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code style="background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 3px;">$1</code>'
  );

  // Format bold
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Format line breaks
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
};

export default ChatMessage;

