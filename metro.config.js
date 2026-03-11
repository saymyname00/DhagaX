const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// No array modification to avoid Node compatibility issues
module.exports = config;
