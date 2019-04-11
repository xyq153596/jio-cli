const fse = require("fs-extra");
const semver = require("semver");

module.exports = class Utils {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * 项目是否为空
   */
  isProjectEmpty() {
    const select = Object.keys(this.ctx.temDb.store).filter(item => {
      return item !== "local";
    });
    if (select.length === 0) {
      this.ctx.logger.warn("请先创建项目");
      process.exit(0);
    }
  }

  /**
   * 更新最终模版版本
   */
  updateLastVersion() {
    this.ctx.genDb.set(
      `${this.ctx.generator}.temVersion`,
      this.ctx.lastVersion
    );
  }

  /**
   * 是否存在本地项目
   */
  isExistLocal() {
    return (
      this.ctx.temDb.has("local") &&
      fse.pathExistsSync(this.ctx.temDb.get("local").path)
    );
  }

  /**
   * 项目是否需要更新
   * @param {String} project
   */
  isNeedUpdate(project) {
    return semver.gt(
      this.ctx.lastVersion,
      this.ctx.temDb.get(`${project}.version`)
    );
  }

  /**
   *  更新版本号
   * @param {*} projectName 项目名或为空
   */
  updateCliVersion(projectName) {
    const CLI_VERSION = this.ctx.lastVersion;
    const VERSION = this.ctx.temDb.get(`${projectName}.version`);
    this.ctx.temDb.set(`${projectName}.version`, CLI_VERSION);
    return {
      name: projectName,
      cli_version: CLI_VERSION,
      version: VERSION
    };
  }
};
