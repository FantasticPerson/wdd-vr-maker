const path = require("path");
const fs = require("fs");

let cssPath = path.resolve(__dirname, "./build/static/css");

let dirs = fs.readdirSync(cssPath);
let cssP = dirs.find(item => item.indexOf(".map") < 0);
let fullPath = path.resolve(cssPath, `./${cssP}`);

let content = fs.readFileSync(fullPath,'utf-8')
content = content.replace(/static\/media/g,'../media')
fs.writeFileSync(fullPath,content,'utf-8')
