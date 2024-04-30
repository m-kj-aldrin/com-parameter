import "../src/custom-elements/index.js";

let module0 = document.createElement("com-module");
document.body.append(module0);

module0.innerHTML = `
<com-parameter order=0>
    <com-input type="range" value="-16" min="-32" max="32" step="1"></com-input>
</com-parameter>
`;

