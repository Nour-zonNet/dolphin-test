export default {
  plugins: {
    // Add OKLCH color fallbacks for Safari 14/iOS 14 compatibility
    '@csstools/postcss-oklab-function': {
      preserve: true, // Keep OKLCH for modern browsers while adding RGB fallbacks
    },
    // Add color-mix() fallbacks for older browsers
    '@csstools/postcss-color-mix-function': {
      preserve: true,
    },
    // Use postcss-preset-env for additional compatibility features
    'postcss-preset-env': {
      stage: 3,
      features: {
        'oklab-function': false, // We handle this with the specific plugin above
        'color-mix': false, // We handle this with the specific plugin above
      },
      autoprefixer: {
        flexbox: 'no-2009',
      },
    },
  },
};
