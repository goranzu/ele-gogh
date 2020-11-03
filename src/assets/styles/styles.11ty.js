"use strict";

const path = require("path");
const sass = require("node-sass");
const CleanCSS = require("clean-css");
const cssesc = require("cssesc");

const isProd = process.env.ELEVENTY_ENV === "production";

module.exports = class {
  data() {
    const entryPath = path.join(
      process.cwd(),
      "src",
      "assets",
      "styles",
      "main.scss",
    );
    return {
      permalink: "/assets/styles/main.css",
      eleventyExcludeFromCollection: true,
      entryPath,
    };
  }

  compile(cfg) {
    return new Promise((resolve, reject) => {
      if (!isProd) {
        cfg.sourceMap = true;
        cfg.sourceMapEmbed = true;
        cfg.outputStyle = "expanded";
      }
      return sass.render(cfg, (err, data) => {
        if (err) return reject(err);

        return resolve(data.css.toString());
      });
    });
  }

  minify(css) {
    return new Promise((resolve, reject) => {
      if (!isProd) return resolve(css);

      const minified = new CleanCSS().minify(css);
      if (!minified.styles) return reject(minified.errors);

      return resolve(minified.styles);
    });
  }

  renderError(error) {
    return `
    /* Error compiling stylesheet */
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    html,
    body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        font-family: monospace;
        font-size: 1.25rem;
        line-height:1.5;
    } 
    body::before { 
        content: ''; 
        background: #000;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        opacity: 0.7;
        position: fixed;
    }
    body::after { 
        content: '${cssesc(error)}'; 
        white-space: pre;
        display: block;
        top: 0; 
        padding: 30px;
        margin: 50px;
        width: calc(100% - 100px);
        color:#721c24;
        background: #f8d7da;
        border: solid 2px red;
        position: fixed;
    }`;
  }

  async render({ entryPath }) {
    try {
      const css = await this.compile({ file: entryPath });
      const result = await this.minify(css);
      return result;
    } catch (error) {
      if (isProd) {
        throw new Error(error);
      } else {
        console.error(error);
        const msg = error.formatted || error.message;
        return this.renderError(msg);
      }
    }
  }
};
