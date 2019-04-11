const Conf = require("conf");
const store = require("./store");
const logger = require("./logger");
const Paths = require("./paths");
const LoadConfig = require("./LoadConfig");
const Actions = require("./Actions");
const Utils = require("./utils");
const Prompt = require("./prompt");

module.exports = class Jio {
  constructor() {
    this.ctx = {
      store,
      logger
    };
    this.ctx.genDb = this.ctx.store.getDb("generator");
    this.prompt = new Prompt(this.ctx);
  }
  async init() {
    this.ctx.generator = await this.selectGenerator();

    this.ctx.temDb = this.ctx.store.getDb(this.ctx.generator);
    this.ctx.logger.setOptions({ logLevel: 3 });
    this.ctx.paths = new Paths(this.ctx);
    this.ctx.lastVersion = this._getLastVersion();
    this.utils = new Utils(this.ctx);
    this.loadConfig = new LoadConfig(this.ctx);
    this.actions = new Actions(this.ctx);

    this.utils.updateLastVersion();
  }
  _getLastVersion() {
    const allUpdateVersions = this.ctx.paths.allUpdateVersions;
    if (allUpdateVersions) {
      const last = allUpdateVersions[allUpdateVersions.length - 1];
      return last;
    } else {
      return "1.0.0";
    }
  }

  //创建完后
  async _afterCreate(config, projectName) {
    const pkg = new Conf({
      cwd: config.targetPath,
      configName: "package"
    });
    pkg.set("name", projectName);
    pkg.set(
      "project.dirName",
      projectName.slice(projectName.lastIndexOf("_") + 1)
    );
  }
  /**
   * 添加初始化生成器
   */
  async initGenerator() {
    const answers = await this.prompt.runInitGeneratorPrompt();
    if (!this.ctx.genDb.get(answers.name)) {
      this.ctx.genDb.set(answers.name, {
        path: answers.path,
        temVersion: "1.0.0"
      });
    } else {
      this.ctx.logger.error("生成器已存在");
    }
  }
  /**
   * 选择生成器
   */
  async selectGenerator() {
    if (Object.keys(this.ctx.genDb.store).length === 0) {
      this.ctx.logger.warn("请先创建生成器");
      process.exit(1);
    } else {
      const answers = await this.prompt.runSelectGeneratorPrompt(
        this.ctx.genDb
      );
      return answers.name;
    }
  }
  async updateLocalProject() {
    if (!this.utils.isNeedUpdate("local")) {
      this.ctx.logger.projectInfo("local", "不用更新");
      return;
    }
    let config = this.loadConfig.loadUpdateConfig("local");
    await this.actions.runUpdateAction(config);
    this.utils.updateCliVersion("local");
    this.ctx.logger.projectSuccess("local", "更新完成");
  }
  async updateProject(name) {
    this.utils.isProjectEmpty();
    let project = name;
    if (!project) {
      const answers = await this.prompt.runUpdatePrompt(this.ctx.temDb);
      project = answers.name;
    }
    if (this.utils.isNeedUpdate(project)) {
      let config = this.loadConfig.loadUpdateConfig(project);
      await this.actions.runUpdateAction(config);
      this.utils.updateCliVersion(project);
      this.ctx.logger.projectSuccess(project, "更新完成");
    } else {
      this.ctx.logger.projectInfo(project, "不用更新");
    }
  }
  async updateAll() {
    this.utils.isProjectEmpty();
    let answers = await this.prompt.runUpdateAllPrompt();
    if (answers.result) {
      let projectList = Object.keys(this.ctx.temDb.store).filter(item => {
        return item !== "local";
      });
      for (let i = 0; i < projectList.length; i++) {
        await this.updateProject(projectList[i]);
      }
    }
  }
  async createProject() {
    let answers = await this.prompt.runCreatePrompt(this.ctx.temDb);
    //如果不存在local template文件就创建一个
    if (!this.utils.isExistLocal()) {
      await this.createLocalProject();
    }
    // 如果local template 不是最新的就更新local template
    if (this.utils.isNeedUpdate("local")) {
      await this.updateLocalProject();
    }
    let config = this.loadConfig.loadCreateConfig(answers);
    await this.actions.runCreateAction(config);
    this.ctx.temDb.set(answers.name, {
      path: config.targetPath,
      version: this.ctx.temDb.get("local.version")
    });
    await this._afterCreate(config, answers.name);
    this.ctx.logger.projectSuccess(
      `${answers.name} -> ${config.targetPath}`,
      "创建完成"
    );
  }

  async createLocalProject() {
    let config = this.loadConfig.loadCreateConfig("local");
    await this.actions.runCreateAction(config);
    this.ctx.temDb.set("local", {
      path: config.targetPath,
      version: "1.0.0"
    });
    this.ctx.logger.projectSuccess("local", "创建完成");
  }
  showDB() {
    this.ctx.logger.showProjectList(this.ctx.temDb);
  }
  showDBPath() {
    this.ctx.logger.showDBPath(this.ctx.temDb);
  }
};
