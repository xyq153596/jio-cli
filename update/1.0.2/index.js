module.exports = {
  actions: [
    {
      path: "./conf.json",
      type: "u",
      async run(source, { json }) {
        json.adddd = "1";
        return JSON.stringify(json, "", "\t");
      }
    }
  ]
};
