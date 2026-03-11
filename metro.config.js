const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Safe reverse for all Node versions
config.resolver.sourceExts = config.resolver.sourceExts.slice().reverse();

module.exports = config;
