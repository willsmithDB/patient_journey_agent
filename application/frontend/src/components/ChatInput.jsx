import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Textarea,
  IconButton,
  Button,
  Text,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      window.location.reload();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
    >
      <Flex gap={3} align="flex-end">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a patient's healthcare journey..."
          maxLength={2000}
          rows={1}
          resize="none"
          bg="white"
          border="2px"
          borderColor="gray.200"
          _focus={{
            borderColor: 'brand.500',
            boxShadow: 'none',
          }}
          _hover={{
            borderColor: 'gray.300',
          }}
        />
        <IconButton
          type="submit"
          icon={<FiSend />}
          colorScheme="brand"
          isDisabled={!message.trim() || isLoading}
          isLoading={isLoading}
          size="lg"
          borderRadius="full"
          aria-label="Send message"
        />
      </Flex>
      
      <Flex justify="space-between" align="center" mt={2}>
        <Text fontSize="xs" color="gray.500">
          {message.length} / 2000
        </Text>
        <Button
          size="xs"
          variant="ghost"
          colorScheme="gray"
          onClick={handleClear}
        >
          Clear Chat
        </Button>
      </Flex>
    </Box>
  );
};

export default ChatInput;

