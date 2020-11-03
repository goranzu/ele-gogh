"use strict";

const shortcodes = require("./lib/shortcodes");
const transforms = require("./lib/transforms");

module.exports = (cfg) => {
  // Transforms
  Object.keys(transforms).forEach(function registerTransforms(t) {
    cfg.addTransform(t, transforms[t]);
  });

  Object.keys(shortcodes).forEach(function registerShortcodes(s) {
    cfg.addShortcode(s, shortcodes[s]);
  });

  cfg.addPassthroughCopy("./src/assets/images");

  cfg.addWatchTarget("./src/assets");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
