module.exports = {
  moduleNameMapper: {
    '^@vercel/analytics/react
: '<rootDir>/src/__mocks__/@vercel/analytics/react.js',
    '^react-leaflet
: '<rootDir>/src/__mocks__/react-leaflet.js',
    '^leaflet
: '<rootDir>/src/__mocks__/leaflet.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-leaflet|@vercel)/)',
  ],
};
