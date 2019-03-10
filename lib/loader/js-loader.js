const babel = require("@babel/core");
const parseSync = babel.parseSync;
module.exports = class js_loader {
  createContext(source) {
    return {
      ast: parseSync(source),
      babel
    };
  }
};
