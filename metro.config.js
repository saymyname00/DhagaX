const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fix for older Node environments
if (Array.prototype.toReversed) {
  config.resolver.sourceExts = config.resolver.sourceExts.toReversed();
} else {
  config.resolver.sourceExts = config.resolver.sourceExts.slice().reverse();
}

module.exports = config;
