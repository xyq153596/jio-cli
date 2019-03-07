const lodash = require("lodash");
module.exports = class json_loader {
  createContext(source) {
    return {
      json: JSON.parse(source),
      _: lodash
    };
  }
};
