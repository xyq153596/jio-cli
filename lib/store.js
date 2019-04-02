const Conf = require("conf");
const path = require("path");
const os = require("os");

class Store {
  constructor() {
    this.homedir = path.join(os.homedir(), ".jio");
  }
  getDb(name) {
    const dbPath = path.join(this.homedir, name + ".json");
    const dbInfo = path.parse(dbPath);
    return new Conf({
      cwd: dbInfo.dir,
      configName: dbInfo.name
    });
  }

  getProjectList() {
    return this.db.store;
  }
  getProject(name) {
    return this.db.get(name);
  }
  setProject(...arg) {
    this.db.set(...arg);
  }
  clearDB() {
    this.db.clear();
  }
}
module.exports = new Store();
