import "../src/custom-elements/index.js";

let module0 = document.createElement("com-module");
module0.setType("lfo");

let module1 = document.createElement("com-module");
module1.setType("bch");

document.body.append(module0, module1);