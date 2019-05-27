const fse = require("fs-extra");
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
      if (loader) {
        result = await queue[i].call(
          this,
          result,
          loader.createContext(result)
        );
      } else {
        throw new Error("没有该文件的加载器");
      }

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
  /**
   * 执行更新程序
   * @param {Array} config
   */
  async runUpdateAction(config) {
    const result = config;
    for (let i = 0; i < result.length; i++) {
      //得到对应的解析器
      if (/^\.(json$|js$)/.test(result[i].ext)) {
        const loader = createLoader(result[i].ext);
        result[i].targetSource = await run(
          result[i].targetSource,
          result[i].runQueue,
          loader
        );
      } else {
        result[i].targetSource = await run(
          result[i].targetSource,
          result[i].runQueue
        );
      }

      delete result[i].runQueue;
    }
    result.forEach(({ targetPath, targetSource }) => {
      fse.writeFileSync(targetPath, targetSource, { encoding: "utf-8" });
    });
  }
  /**
   * 执行创建程序
   * @param {config} config
   */
  async runCreateAction(config) {
    return await fse.copy(config.path, config.targetPath, {
      filter: this._filterFiles
    });
  }
  _filterFiles(src, dest) {
    return src.indexOf("node_modules") < 0;
  }
};
