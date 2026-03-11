const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Do not modify arrays; keep Expo defaults to avoid Node compatibility issues
module.exports = config;
