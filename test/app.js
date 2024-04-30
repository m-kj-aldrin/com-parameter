import "../src/custom-elements/index.js";

let chain0 = document.createElement("div");
chain0.classList.add("chain");

let chain1 = document.createElement("div");
chain1.classList.add("chain");

document.body.append(chain0, chain1);

let module0 = document.createElement("com-module");
module0.setType("lfo");

let module1 = document.createElement("com-module");
module1.setType("bch");

let module2 = document.createElement("com-module");
module2.setType("pth");

chain0.append(module0, module1);
chain1.append(module2);
