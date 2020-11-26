const path = require("path");
const fs = require("fs");

let cssPath = path.resolve(__dirname, "./build/static/css");


let dirs = fs.readdirSync(cssPath);
let cssP = dirs.filter((item) => item.indexOf(".map") < 0);

cssP.map((item) => {
	let fullPath = path.resolve(cssPath, `./${item}`);

	let content = fs.readFileSync(fullPath, "utf-8");
	content = content.replace(/static\/media/g, "../media");
	fs.writeFileSync(fullPath, content, "utf-8");
});
