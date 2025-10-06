import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import SampleQueries from '../components/SampleQueries';
import ChatInput from '../components/ChatInput';
import StatusBadge from '../components/StatusBadge';
import { sendMessageToAgent } from '../utils/api';

const ChatView = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Hide welcome message
    setShowWelcome(false);

    // Add user message
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation history for agent
      const conversationHistory = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: messageText,
        },
      ];

      // Call agent
      const response = await sendMessageToAgent(conversationHistory);

      // Extract assistant message
      const agentMessages = response.messages || [];
      const lastMessage = agentMessages[agentMessages.length - 1];

      if (lastMessage && lastMessage.content) {
        const assistantMessage = {
          role: 'assistant',
          content: lastMessage.content,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('No response from agent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please check your configuration and try again.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuery = (query) => {
    handleSendMessage(query);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg="linear-gradient(135deg, #FF3621 0%, #E62E1C 100%)"
        color="white"
        py={6}
        px={8}
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="lg" mb={1}>
                🏥 Patient Journey Assistant
              </Heading>
              <Text fontSize="sm" opacity={0.9}>
                Healthcare AI powered by Databricks
              </Text>
            </Box>
            <StatusBadge />
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={6}>
        <Grid
          templateColumns={{ base: '1fr', lg: '320px 1fr' }}
          gap={6}
          h="calc(100vh - 200px)"
        >
          {/* Sidebar - Hidden on mobile */}
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <Box
              bg="white"
              borderRadius="xl"
              p={6}
              boxShadow="sm"
              h="full"
              overflowY="auto"
            >
              <SampleQueries onSelectQuery={handleSelectQuery} />
            </Box>
          </GridItem>

          {/* Chat Area */}
          <GridItem>
            <Flex
              direction="column"
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              h="full"
              overflow="hidden"
            >
              {/* Messages */}
              <Box flex="1" overflowY="auto" p={6}>
                {showWelcome && messages.length === 0 && !isLoading && (
                  <Center h="full">
                    <VStack spacing={4} textAlign="center" maxW="lg">
                      <Heading size="lg" color="gray.700">
                        Welcome to the Patient Journey Assistant
                      </Heading>
                      <Text color="gray.600">
                        Ask questions about patient healthcare journeys,
                        medical claims, pharmacy data, diagnoses, and
                        procedures.
                      </Text>
                      <Text fontSize="sm" color="brand.500" fontStyle="italic">
                        💡 Click on a sample query or type your own question
                        below
                      </Text>
                    </VStack>
                  </Center>
                )}

                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    isUser={message.role === 'user'}
                  />
                ))}

                {isLoading && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatView;

