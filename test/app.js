import "../src/custom-elements/index.js";

let module0 = document.createElement("com-module");
document.body.append(module0);

module0.innerHTML = `
<com-parameter order=1>
    <com-input type="range" value="0" min="0" max="1" step="0.001">
        <label>amp</label>
    </com-input>
</com-parameter>
<com-parameter order=0>
    <com-input type="range" value="0" min="0" max="1000" step="0.001">
        <label>frq</label>
    </com-input>
</com-parameter>
`;
