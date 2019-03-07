const fse = require("fs-extra");
const path = require("path");
const { createLoader } = require("./loader");

/**
 *
 * @param {String} source 源码
 * @param {Array} queue 执行列队
 */
async function run(source, queue, loader) {
  let result = source;

  for (let i = 0; i < queue.length; i++) {
    if (typeof queue[i] === "string" || queue[i] === "") {
      result = queue[i];
    } else {
      result = await queue[i].call(this, result, loader.createContext(result));
      if (typeof result !== "string") {
        throw new Error("处理结果必须为字符串。");
      }
    }
  }

  return result;
}

module.exports = class Actions {
  constructor(ctx) {
    this.ctx = ctx;
  }
  async runUpdateAction(config) {
    const result = config;
    for (let i = 0; i < result.length; i++) {
      //得到对应的解析器
      const loader = createLoader(result[i].ext);
      result[i].targetSource = await run(
        result[i].targetSource,
        result[i].runQueue,
        loader
      );
      delete result[i].runQueue;
    }
    result.forEach(({ targetPath, targetSource }) => {
      fse.writeFileSync(targetPath, targetSource, { encoding: "utf-8" });
    });
  }
  async runCreateAction(config) {
    return await fse.copy(config.path, config.targetPath);
  }
  /**
   *
   * @param {*} projectName 项目名或为空
   */
  updateCliVersion(projectName) {
    const CLI_VERSION = this.ctx.lastVersion;
    const VERSION = this.ctx.store.getProject(`${projectName}.version`);
    this.ctx.store.setProject(`${projectName}.version`, CLI_VERSION);
    return {
      name: projectName,
      cli_version: CLI_VERSION,
      version: VERSION
    };
  }
};
