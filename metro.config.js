const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Compatible array reverse for all Node versions
config.resolver.sourceExts = [...config.resolver.sourceExts].reverse();

module.exports = config;
