
module.exports = class js_loader {
  createContext(source) {
    return {
      ast: source
    };
  }
};
