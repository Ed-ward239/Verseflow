// Tell CRA's PostCSS loader to read postcss.config.js (where Tailwind +
// autoprefixer live). The inline-plugins approach is flaky on CRA 5, so we
// drive PostCSS from the config file instead.
module.exports = {
  style: {
    postcss: {
      mode: "file",
    },
  },
};
