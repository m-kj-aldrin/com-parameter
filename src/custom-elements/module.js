let resetText = await (await fetch("/src/style/reset.css")).text();
let resetStyleSheet = new CSSStyleSheet();
resetStyleSheet.replaceSync(resetText);

const template = document.createElement("template");
template.innerHTML = `
<style>
    :host{
        display: block;
        border: 1px currentColor solid;
        border-radius: 2px;
    }
    #header{
        background: #f5f5f5;
        padding: 2px 8px;

        display: flex;
        justify-content: space-between;

        gap: 16px;
    }
    #body{
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    slot[name='type']{
        font-size: 16px;
    }
</style>
<div id="header">
  <slot name="type"></slot>
  <button data-action="remove">del</button>
</div>
<div id="body">
  <slot></slot>
</div>
`;

const pthTemplate = document.createElement("template");
pthTemplate.innerHTML = `
<div slot="type">pth</div>
`;

const lfoTemplate = document.createElement("template");
lfoTemplate.innerHTML = `

<div slot="type">lfo</div>

<com-parameter order="0">
  <com-input type="range" value="20.00" min="0" max="200" step="0.001">
    <label>frq</label>
  </com-input>
</com-parameter>
<com-parameter order="1">
  <com-input type="range" value="0.25" min="0" max="1" step="0.001">
    <label>amp</label>
  </com-input>
</com-parameter>
<com-parameter order="2">
  <com-input type="range" value="12" min="0" max="16" step="1">
    <label>selector</label>
  </com-input>
</com-parameter>
`;

const bchTemplate = document.createElement("template");
bchTemplate.innerHTML = `

<div slot="type">bch</div>

<com-parameter order="0">
  <com-input type="range" value="0.5" step="0.001">
    <label>cha</label>
  </com-input>
</com-parameter>
`;

/**@type {Record<import("../../types").ModuleTypes,HTMLTemplateElement>} */
const MODULE_TEMPLATES = {
    pth: pthTemplate,
    lfo: lfoTemplate,
    bch: bchTemplate,
};

export class ModuleElement extends HTMLElement {
    #type = "";

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.adoptedStyleSheets = [resetStyleSheet];

        this.shadowRoot.append(template.content.cloneNode(true));

        this.#attachListeners();

        let typeAttr = this.getAttribute("type");
        this.setType(typeAttr);
    }

    /**@param {import("../../types").ModuleTypes} type */
    setType(type) {
        let template = MODULE_TEMPLATES[type];
        if (template && !this.#type) {
            this.append(template.content.cloneNode(true));
            this.#type = type;
            if (type == "pth") {
                this.shadowRoot.getElementById("body").remove();
            }
        }
    }

    #attachListeners() {
        this.shadowRoot.addEventListener(
            "click",
            this.#actionHandler.bind(this)
        );
    }

    /**@param {MouseEvent} e */
    #actionHandler(e) {
        if (!(e.target instanceof HTMLButtonElement)) return;

        let actionAttr = e.target.getAttribute("data-action");

        switch (actionAttr) {
            case "remove":
                this.remove();
                break;
        }
    }

    /**@param {"remove" | "insert"} type */
    #signal(type) {
        let cidx = 0;
        let midx = 0;

        let signalString = "";

        switch (type) {
            case "insert":
                signalString = `module -c ${cidx} -i ${midx} ${this.#type}`;
                break;
            case "remove":
                signalString = `module -c ${cidx} -r ${midx}`;
                break;
        }

        console.log(signalString);
    }

    remove() {
        this.#signal("remove");
        super.remove();
    }

    connectedCallback() {
        this.#signal("insert");
    }
}
