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

    this.allUpdateVersions = this._getAllUpdateVersions();
  }
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
}

module.exports = new Paths();
