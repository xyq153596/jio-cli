const inquirer = require("inquirer");
const store = require("./store");
const logger = require("./logger");

module.exports.runCreatePrompt = async () => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "项目名",
      validate(input) {
        if (!/^fe_[a,f]_[0-9a-zA-Z]+$/g.test(input)) {
          return logger.error("错误的项目名");
        }
        if (store.db.has(input)) {
          return logger.error("该项目已存在");
        }
        return true;
      }
    },
    {
      type: "input",
      name: "path",
      message: "项目路径",
      default: process.cwd()
    }
  ]);
};

module.exports.runUpdatePrompt = async () => {
  const select = Object.keys(store.getProjectList()).filter(item => {
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
};

module.exports.runUpdateAllPrompt = async () => {
  return await inquirer.prompt([
    {
      type: "confirm",
      name: "result",
      message: "是否更新所有项目？"
    }
  ]);
};
