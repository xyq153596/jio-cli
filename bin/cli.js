#!/usr/bin/env node
const program = require("commander");
const { version } = require("../package.json");
const logger = require("../lib/logger.js");
const Jio = require("../lib/index");

/**
 * jio-cli update 更新单个项目
 * jio-cli update --all 更新所有项目
 * jio-cli create 创建项目
 * jio-cli create --local 创建本地template
 * jio-cli db 显示项目列表
 * jio-cli db --path 显示db路径
 * jio-cli -V 显示脚手架版本
 * jio-cli register 注册生成器
 */
const jio = new Jio();
program
  .command("init [option]")
  .description("注册一个生成器项目")
  .action((cmd, options) => {
    jio.initGenerator();
  })
  .on("--help", () => {
    console.log("");
    console.log("举个🌰:");
    console.log("  $ jio-cli update -a");
    console.log("  $ jio-cli update --all");
  });

program
  .command("update [option]")
  .description("更新单个项目")
  .option("-a,--all", "更新所有项目")
  .option("-l,--local", "更新本地内部项目")
  .action(async (cmd, options) => {
    await jio.init();
    if (options.all) {
      jio.updateAll().catch(error => {
        logger.error(error);
      });
    } else if (options.local) {
      jio.updateLocalProject().catch(error => {
        logger.error(error);
      });
    } else {
      jio.updateProject().catch(error => {
        logger.error(error);
      });
    }
  })
  .on("--help", () => {
    console.log("");
    console.log("举个🌰:");
    console.log("  $ jio-cli update -a");
    console.log("  $ jio-cli update --all");
  });
program
  .command("create [option]")
  .description("创建项目")
  .option("-l,--local", "创建内部项目")
  .action(async (cmd, options) => {
    await jio.init();
    if (options.local) {
      jio.createLocalProject().catch(error => {
        logger.error(error);
      });
    } else {
      jio.createProject().catch(error => {
        logger.error(error);
      });
    }
  })
  .on("--help", () => {
    console.log("");
    console.log("举个🌰:");
    console.log("  $ jio-cli create -l");
    console.log("  $ jio-cli create --local");
  });
program
  .command("db [option]")
  .description("显示项目列表")
  .option("-p,--path", "显示db路径")
  .action(async (cmd, options) => {
    await jio.init();
    if (options.path) {
      jio.showDBPath();
    } else {
      jio.showDB();
    }
  })
  .on("--help", () => {
    console.log("");
    console.log("举个🌰:");
    console.log("  $ jio-cli db -p");
    console.log("  $ jio-cli db --path");
  });

program.version(version).parse(process.argv);
