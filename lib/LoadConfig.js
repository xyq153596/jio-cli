const path = require("path");
const fse = require("fs-extra");
const semver = require("semver");
module.exports = class LoadConfig {
  constructor(ctx) {
    this.ctx = ctx;
  }
  /**
   *
   * @param {Object} target 目标项目的路径和名称
   */
  loadCreateConfig(target) {
    return target === "local"
      ? {
          path: this.ctx.paths.TEM_INITAL_PATH,
          targetPath: this.ctx.paths.TEM_LAST_PATH
        }
      : {
          path: this.ctx.paths.TEM_LAST_PATH,
          targetPath: path.resolve(target.path.trim(), target.name.trim())
        };
  }
  /**
   * 得到相关如下格式的配置信息
   * [
      {
        targetPath: "", //目标路径
        targetSource: "", //目标源码
        runQueue: []// 执行列队
      }
    ]
   * @param {any} project 项目名
   * @return {Array}
   */
  loadUpdateConfig(project) {
    // 1.先根据配置确定更新本地还是用户项目
    const TEM_PATH = this.ctx.paths.getProjectInfo(project).path;

    //2.根据cli版本号确定需要更新的版本路径
    const TEM_CLI_VERSION = this.ctx.paths.getProjectInfo(project).version;

    const CLI_VERSION = this.ctx.lastVersion;
    const updateMaps = this.ctx.paths.getSectionVersionPath(
      TEM_CLI_VERSION,
      CLI_VERSION
    );
    //没有更新内容就直接返回
    if (updateMaps.size === 0) {
      return [];
    }
    //3.获取更新配置，并且优化结构
    let resultMap = new Map();
    for (let [v, updatePath] of updateMaps) {
      let updateFileSource = require(updatePath);
      updateFileSource.actions.forEach(item => {
        let fileName = path.resolve(TEM_PATH, item.path);
        let fileConfig = {};
        if (!resultMap.has(fileName)) {
          //目标文件路径
          fileConfig.targetPath = path.resolve(TEM_PATH, item.path);
          //如果文件不存在就说明是添加选项
          if (fse.pathExistsSync(fileConfig.targetPath)) {
            fileConfig.targetSource = fse.readFileSync(fileConfig.targetPath, {
              encoding: "utf-8"
            });
          } else {
            fileConfig.targetSource = "";
          }

          fileConfig.runQueue = [];
        } else {
          fileConfig = resultMap.get(fileName);
        }

        fileConfig.runQueue.push({
          version: v,
          type: item.type,
          run:
            typeof item.run === "string"
              ? fse.readFileSync(path.resolve(updatePath, item.run), {
                  encoding: "utf-8"
                })
              : item.run
        });
        resultMap.set(fileName, fileConfig);
      });
    }
    //3.1 开始优化结构
    //3.1.1 先过滤出添加或替换的方法列队
    for (let [file, config] of resultMap) {
      let optimizeQueue = [];
      //添加后缀名用于调用相应的解析器
      config.ext = path.parse(file).ext;
      //过滤掉更新的方法
      optimizeQueue = config.runQueue.filter(item => {
        return item.type !== "u";
      });
      if (optimizeQueue.length <= 1) {
        config.runQueue = config.runQueue.map(item => {
          return item.run;
        });
      } else {
        //3.1.2 得出最大版本号
        const MAX_VERSION = optimizeQueue.sort((a, b) => {
          return semver.compare(b.version, a.version);
        })[0].version;
        //3.1.3 从添加或替换的最大版本号开始组成最后的方法列队
        optimizeQueue = config.runQueue.filter(item => {
          return semver.gte(item.version, MAX_VERSION);
        });
        //3.1.4 最后只获取方法的内容
        config.runQueue = optimizeQueue.map(item => {
          return item.run;
        });
      }
    }

    return Array.from(resultMap.values());
  }
};
