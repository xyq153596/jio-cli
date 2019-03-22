const inquirer = require("inquirer");
const store = require("./store");

module.exports.runCreatePrompt = async () => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "项目名",
      validate(input) {
        if (!/^fe_[a,s,w,h]_[0-9a-zA-Z]+$/g.test(input)) {
          return "错误的项目名,请输入例如‘fe_a_项目名’"
        }
        if (store.db.has(input)) {
          return "该项目已存在"
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
