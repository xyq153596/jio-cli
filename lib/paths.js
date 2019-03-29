const path = require("path");
const store = require("./store");
const semver = require("semver");
const glob = require("fast-glob");
class Paths {
  constructor() {
    /**
     * 当前目录
     */
    this.CWD = process.cwd();
    /**
     * CLI目录
     */
    this.ROOT = path.resolve(__dirname, "../");
    /**
     * 更新配置目录
     */
    this.UPDATE_PATH = path.resolve(this.ROOT, "update");
    /**
     * 插件配置目录
     */
    this.PLUGINS_PATH = path.resolve(this.ROOT, "plugins");
    /**
     * 模版目录
     */
    this.TEM_PATH = path.resolve(this.ROOT, "template");
    /**
     * 最初模版目录
     */
    this.TEM_INITAL_PATH = path.resolve(this.ROOT, "template", "initial");
    /**
     * 最新模板目录
     */
    this.TEM_LAST_PATH = path.resolve(this.ROOT, "template", "last");
    /**
     * 创建项目配置文件
     */
    this.CREATE_FILE_PATH = path.resolve(this.ROOT, "create");
    /**
     * 所有更新版本数组
     */
    this.allUpdateVersions = this._getAllUpdateVersions();
    /**
     * 所有插件数组
     */
    this.allPlugins = this._getAllPlugins();
  }
  /**
   * -------------------- updates -------------------------
   */
  /**
   * 获取所有更新版本
   * @returns {Array}
   */
  _getAllUpdateVersions() {
    let updateVersions = glob.sync(`${this.UPDATE_PATH}/*`, {
      onlyDirectories: true
    });
    if (updateVersions.length === 0) {
      return;
    }
    updateVersions = updateVersions.map(item => {
      return path.parse(item).base;
    });
    updateVersions.sort((a, b) => {
      return semver.compare(a, b);
    });
    return updateVersions;
  }
  /**
   * 根据项目名返回项目路径
   * @param {String} name
   */
  getProjectInfo(name) {
    return store.getProject(name);
  }
  /**
   * 返回一段版本号
   * @param {String} from 开始版本号
   * @param {String} to 结束版本号
   * @return {Map}
   */
  getSectionVersionPath(from = "1.0.0", to = "") {
    let versionMap = new Map();
    this.allUpdateVersions
      .filter(item => {
        return semver.satisfies(item, `>${from} <=${to}`);
      })
      .forEach(item => {
        versionMap.set(item, path.resolve(this.UPDATE_PATH, item));
      });
    return versionMap;
  }
  getUpdatePathByVersion(version) {
    return path.resolve(this.UPDATE_PATH, version);
  }

  /**
   * -------------------- plugins -------------------------
   */
  /**
   * 得到所有的插件
   * @returns {Array}
   */
  _getAllPlugins() {
    let plugins = glob.sync(`${this.PLUGINS_PATH}/*`, {
      onlyDirectories: true
    });
    if (plugins.length === 0) {
      return [];
    }
    plugins = plugins.map(item => {
      return path.parse(item).base;
    });
    return plugins;
  }
  /**
   * 根据名称查找插件路径
   * @param {String} name 插件名
   * @return {String}
   */
  getPluginPathByName(name) {
    this.allPlugins.findIndex(item => {
      return item === name;
    }) > 0
      ? path.resolve(this.PLUGINS_PATH, name)
      : "";
  }
}

module.exports = new Paths();
