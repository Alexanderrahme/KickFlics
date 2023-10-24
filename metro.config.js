// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const defaultAssetExts = require("metro-config/src/defaults/defaults").assetExts;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    assetExts: [
      ...defaultAssetExts,
      'tflite', // Add your custom file extensions here
      'txt',
    ],
  },
};
