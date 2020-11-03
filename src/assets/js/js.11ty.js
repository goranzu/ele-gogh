"use strict";

const path = require("path");
const rollup = require("rollup");
const terser = require("rollup-plugin-terser").terser;

const isProd = process.env.ELEVENTY_ENV === "production";

module.exports = class {
  data() {
    return {
      permalink: "/assets/js/index.js",
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const bundle = await rollup.rollup({
      input: path.join(process.cwd(), "src", "assets", "js", "index.js"),
    });
    const { output } = await bundle.generate({
      format: "es",
      sourcemap: isProd,
      plugins: [
        terser({
          mangle: {
            toplevel: true,
          },
          compress: {
            drop_console: isProd,
            drop_debugger: isProd,
          },
        }),
      ],
    });

    const out = output.length && output[0];
    let code = "";

    if (out) {
      code = out.code;

      if (out.map) {
        let b64 = new Buffer.from(out.map.toString());
        code +=
          "//# sourceMappingURL=data:application/json;base64," +
          b64.toString("base64");
      }
    }
    return code;
  }
};
