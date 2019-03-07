const fse = require("fs-extra");
let a = fse.readFileSync("./a.json", "utf-8");

let json = JSON.parse(a);
json.sb2 = "日你爸爸2";
console.log(json.sb);
fse.writeFileSync("./a.json", JSON.stringify(json, "", "\t"));
