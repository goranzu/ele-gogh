"use strict";

const htmlmin = require("html-minifier");
const critical = require("critical");
const { inlineSource } = require("inline-source");

const BUILD_DIR = "dist";

const shouldTransformHTML = (outputPath) =>
  outputPath &&
  outputPath.endsWith(".html") &&
  process.env.ELEVENTY_ENV === "production";

const isHomePage = (outputPath) => outputPath === `${BUILD_DIR}/index.html`;

process.setMaxListeners(Infinity);

module.exports = {
  htmlmin(content, outputPath) {
    if (shouldTransformHTML(outputPath)) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  },
  async critical(content, outputPath) {
    if (shouldTransformHTML(outputPath) && isHomePage(outputPath)) {
      try {
        const { html } = await critical.generate({
          base: `${BUILD_DIR}/`,
          html: content,
          inline: true,
          width: 1200,
          height: 800,
        });
        return html;
      } catch (error) {
        console.error(error);
      }
    }
    return content;
  },
  async inline(content, outputPath) {
    if (!String(outputPath).endsWith(".html")) {
      return content;
    }
    return inlineSource(content, { compress: true, rootpath: "./dist/" });
  },
};
