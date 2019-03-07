const path = require("path");
const logger = require("../logger");
let cache = new Map();

module.exports.createLoader = ext => {
  const loaderName = `${ext.replace(/^\./, "")}-loader.js`;
  if (cache.has(loaderName)) {
    return cache.get(loaderName);
  } else {
    try {
      Loader = require(path.resolve(__dirname, loaderName));
    } catch (error) {
      logger.error(`没有"${loaderName}"文件的加载器`)
      process.exit(0)
    }
    const loader = new Loader();
    cache.set(loaderName, loader);
    return loader;
  }
};
