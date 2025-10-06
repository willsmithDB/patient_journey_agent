import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#FFE8E5',
      100: '#FFBFB8',
      200: '#FF968A',
      300: '#FF6D5C',
      400: '#FF442E',
      500: '#FF3621', // Primary color
      600: '#E62E1C',
      700: '#CC2818',
      800: '#B32114',
      900: '#991B10',
    },
    secondary: {
      50: '#E6F7F1',
      100: '#B3E8D6',
      200: '#80D9BB',
      300: '#4DCAA0',
      400: '#1ABB85',
      500: '#00A972', // Secondary color
      600: '#00935F',
      700: '#007D4C',
      800: '#006739',
      900: '#005126',
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default theme;

