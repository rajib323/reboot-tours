import type { NextConfig } from "next";

module.exports = {
  webpack: (config:NextConfig) => {
      config.resolve.fallback = {
          ...config.resolve.fallback,
          mongoose: require.resolve("mongoose"),
      };
      return config;
  },
};
