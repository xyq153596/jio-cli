const paths = require("./paths");
const store = require("./store");
const logger = require("./logger");
const LoadConfig = require("./LoadConfig");
const Actions = require("./Actions");
const semver = require("semver");
const {
  runUpdatePrompt,
  runCreatePrompt,
  runUpdateAllPrompt
} = require("./prompt");

module.exports = class Jio {
  constructor() {
    this.paths = paths;
    this.store = store;
    this.logger = logger;
    this.logger.setOptions({ logLevel: 3 });
    this.lastVersion = this._updateLastVersion();
    this.ctx = this._createContext();
    this.loadConfig = new LoadConfig(this.ctx);
    this.actions = new Actions(this.ctx);
  }
  _isProjectEmpty() {
    const select = Object.keys(this.store.getProjectList()).filter(item => {
      return item !== "local";
    });
    if (select.length === 0) {
      this.logger.warn("请先创建项目");
      process.exit(0);
    }
  }
  _updateLastVersion() {
    const allUpdateVersions = this.paths.allUpdateVersions;
    if (allUpdateVersions) {
      const last = allUpdateVersions[allUpdateVersions.length - 1];
      this.store.store.set("tem_version", last);
      return last;
    } else {
      this.store.store.set("tem_version", "1.0.0");
      return "1.0.0";
    }
  }
  _isExistLocal() {
    return this.store.db.has("local");
  }
  _createContext() {
    return {
      paths: this.paths,
      store: this.store,
      logger: this.logger,
      lastVersion: this.lastVersion
    };
  }
  _isNeedUpdate(project) {
    return semver.gt(this.lastVersion, this.store.getProject(project).version);
  }
  async updateLocalProject() {
    if (!this._isNeedUpdate("local")) {
      this.logger.projectInfo("local", "不用更新");
      return;
    }
    let config = this.loadConfig.loadUpdateConfig("local");
    await this.actions.runUpdateAction(config);
    this.actions.updateCliVersion("local");
    this.logger.projectSuccess("local", "更新完成");
  }
  async updateProject(name) {
    this._isProjectEmpty();
    let project = name;
    if (!project) {
      const answers = await runUpdatePrompt();
      project = answers.name;
    }
    if (this._isNeedUpdate(project)) {
      let config = this.loadConfig.loadUpdateConfig(project);
      await this.actions.runUpdateAction(config);
      this.actions.updateCliVersion(project);
      this.logger.projectSuccess(project, "更新完成");
    } else {
      this.logger.projectInfo(project, "不用更新");
    }
  }
  async updateAll() {
    this._isProjectEmpty();
    let answers = await runUpdateAllPrompt();
    if (answers.result) {
      let projectList = Object.keys(this.store.getProjectList()).filter(
        item => {
          return item !== "local";
        }
      );
      for (let i = 0; i < projectList.length; i++) {
        await this.updateProject(projectList[i]);
      }
    }
  }
  async createProject() {
    let answers = await runCreatePrompt();
    //如果不存在local template文件就创建一个
    if (!this._isExistLocal()) {
      await this.createLocalProject();
    }
    // 如果local template 不是最新的就更新local template
    if (this._isNeedUpdate("local")) {
      await this.updateLocalProject();
    }
    let config = this.loadConfig.loadCreateConfig(answers);
    await this.actions.runCreateAction(config);
    this.store.setProject(answers.name, {
      path: config.targetPath,
      version: this.store.getProject("local").version
    });
    this.logger.projectSuccess(
      `${answers.name} -> ${config.targetPath}`,
      "创建完成"
    );
  }

  async createLocalProject() {
    let config = this.loadConfig.loadCreateConfig("local");
    await this.actions.runCreateAction(config);
    this.store.setProject("local", {
      path: config.targetPath,
      version: "1.0.0"
    });
    this.logger.projectSuccess("local", "创建完成");
  }

  showDB() {
    this.logger.showProjectList();
  }
  showDBPath() {
    this.logger.showDBPath();
  }
};
