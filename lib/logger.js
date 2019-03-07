const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const store = require("./store");
class Logger {
  constructor(options) {
    this.options = Object.assign(
      {
        logLevel: 3
      },
      options
    );
    this.spinner = ora();
  }

  setOptions(options) {
    Object.assign(this.options, options);
  }

  // level: 4
  debug(...args) {
    if (this.options.logLevel < 4) {
      return;
    }

    this.status("magenta", "debug", ...args);
  }

  // level: 2
  warn(...args) {
    if (this.options.logLevel < 2) {
      return;
    }
    console.warn(chalk.yellow("[warning]"), ...args);
  }

  // level: 1
  error(...args) {
    if (this.options.logLevel < 1) {
      return;
    }
    process.exitCode = process.exitCode || 1;
    console.error(chalk.red("[error]"), ...args);
  }

  projectInfo(text, ...args) {
    this.status("cyan", "[info]", chalk["gray"](text), ...args);
  }
  projectSuccess(text, ...args) {
    this.status("green", "[success]", chalk["gray"](text), ...args);
  }
  // level: 3
  success(...args) {
    this.status("green", "[success]", ...args);
  }

  // level: 3
  tip(...args) {
    this.status("blue", "[tip]", ...args);
  }

  info(...args) {
    this.status("cyan", "[info]", ...args);
  }

  status(color, label, ...args) {
    if (this.options.logLevel < 3) {
      return;
    }
    console.log(chalk[color](label), ...args);
  }

  fileAction(color, type, fp) {
    if (this.options.logLevel < 3) {
      return;
    }
    this.info(
      `${chalk[color](type)} ${chalk.green(path.relative(process.cwd(), fp))}`
    );
  }

  showDBPath() {
    this.info(store.db.path);
  }
  showProjectList() {
    const list = store.getProjectList();
    Object.keys(list).forEach(item => {
      let p = list[item];
      console.log(
        item,
        `${chalk["gray"](p.path)}`,
        `${chalk["green"](p.version)}`
      );
    });
  }
}

module.exports = new Logger();
