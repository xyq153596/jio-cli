const Conf = require("conf");
const path = require("path");
const os = require("os");

class Store {
  constructor() {
    const db = path.parse(path.join(os.homedir(), ".jio/db.json"));
    const store = path.parse(path.join(os.homedir(), ".jio/store.json"));
    this.db = new Conf({
      cwd: db.dir,
      configName: db.name
    });
    this.store = new Conf({
      cwd: store.dir,
      configName: store.name
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
