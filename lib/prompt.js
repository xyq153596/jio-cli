const inquirer = require("inquirer");
const paths = require("./paths");

module.exports = class Prompt {
  constructor(ctx) {
    this.ctx = ctx;
  }
  async runCreatePrompt(temDb) {
    return await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "项目名",
        validate(input) {
          if (!/^fe_(web|h5|kf|gy|mini)[0-9a-zA-Z]+$/g.test(input)) {
            return "错误的项目名,请输入例如‘fe_web项目名’ 正则表达式：/^fe_(web|h5|kf|gy|mini)[0-9a-zA-Z]+$/g";
          }
          if (temDb.has(input)) {
            return "该项目已存在";
          }
          return true;
        },
        filter(input) {
          return input.toLowerCase();
        }
      },
      {
        type: "input",
        name: "path",
        message: "项目路径",
        default: process.cwd(),
        filter(input) {
          return input.trim();
        }
      }
    ]);
  }

  async runUpdatePrompt(temDb) {
    const select = Object.keys(temDb.store).filter(item => {
      return item !== "local";
    });
    return await inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "项目名",
        choices: select
      }
    ]);
  }

  async runUpdateAllPrompt() {
    return await inquirer.prompt([
      {
        type: "confirm",
        name: "result",
        message: "是否更新所有项目？"
      }
    ]);
  }

  async runAddPluginPrompt(temDb) {
    const plugins = paths.allPlugins;
    const projects = Object.keys(temDb.store).filter(item => {
      return item !== "local";
    });
    return await inquirer.prompt([
      {
        type: "list",
        name: "projectName",
        message: "项目",
        choices: projects
      },
      {
        type: "list",
        name: "pluginName",
        message: "插件",
        choices: plugins
      }
    ]);
  }

  async runInitGeneratorPrompt() {
    return await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "生成器名",
        filter(input) {
          return input.trim();
        }
      },
      {
        type: "input",
        name: "path",
        message: "生成器路径",
        default: process.cwd(),
        filter(input) {
          return input.trim();
        }
      }
    ]);
  }

  async runSelectGeneratorPrompt(genDb) {
    const select = Object.keys(genDb.store);
    return await inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "选择一个生成器",
        choices: select
      }
    ]);
  }
};
