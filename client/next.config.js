/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n
};
