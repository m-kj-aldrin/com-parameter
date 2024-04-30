let inputResetText = await (await fetch("/src/style/input_reset.css")).text();
let inputResetStyleSheet = new CSSStyleSheet();
inputResetStyleSheet.replaceSync(inputResetText);

const template = document.createElement("template");
template.innerHTML = `
<style>
    :host{
        display: flex;
        flex-direction: column;
    }
    ::slotted(label){}
</style>
<slot name="label"></slot>
`;

const rangeTemplate = document.createElement("template");
rangeTemplate.innerHTML = `
<style>

    :host > div{
        position: relative;
    }
    :host(:where(:focus,:hover)) #output
    {
        opacity: 1;
        transition-delay: 0ms;
    }
    ::slotted(label){
        margin-bottom: 10px;
    }
    input{
        cursor: ew-resize;
    }
    #output{
        position: absolute;

        top: -4px;
        transform: translate(-50%,-50%);

        border: none;
        font-size: 11px;
        text-align: center;
        background-color: #fff;
        opacity: 0.25;
        transition: opacity 125ms ease;
        transition-delay: 500ms;
    }
</style>
<div>
    <input type="range" />
    <input id="output" type="number" />
</div>
`;

const numberTemplate = document.createElement("template");
numberTemplate.innerHTML = `
<input type="number" />
`;

const textTemplate = document.createElement("template");
textTemplate.innerHTML = `
<input type="text" />
`;

const selectTemplate = document.createElement("template");
selectTemplate.innerHTML = `
<select></select>
`;

/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 */
function clamp(x, min = 0, max = 1) {
    return Math.min(Math.max(x, min), max);
}

export class CustomInput extends HTMLElement {
    #listenerController = new AbortController();
    #type = "";

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.adoptedStyleSheets = [inputResetStyleSheet];

        this.shadowRoot.append(template.content.cloneNode(true));

        let typeAttr = this.getAttribute("type");

        this.#setType(typeAttr);

        let valueAttr = this.getAttribute("value") ?? 0;
        let minAttr = this.getAttribute("min") ?? 0;
        let maxAttr = this.getAttribute("max") ?? 1;
        let stepAttr = this.getAttribute("step") ?? 0.00000001;

        this.#setInputOptions({
            min: minAttr,
            max: maxAttr,
            step: stepAttr,
            value: valueAttr,
        });

        this.attachListeners();
    }

    get inputElement() {
        return this.shadowRoot.querySelector("input");
    }

    #setInputOptions({ min, max, step, value }) {
        if (this.#type == "text") return;
        if (this.#type == "select") return;

        let inputElement = this.inputElement;

        inputElement.min = min;
        inputElement.max = max;
        inputElement.step = step;
        inputElement.value = value;

        if (this.#type == "range") {
            /**@type {HTMLInputElement} */
            let output = this.shadowRoot.querySelector("#output");
            output.min = min;
            output.max = max;
            output.step = step;
            output.value = value;
        }

        this.#updateOutput();
    }

    /**@param {string} type */
    #setType(type) {
        if (this.#type) return;
        switch (type) {
            case "range":
                this.shadowRoot.append(rangeTemplate.content.cloneNode(true));
                break;
            case "number":
                this.shadowRoot.append(numberTemplate.content.cloneNode(true));
                break;
            case "select":
                this.shadowRoot.append(selectTemplate.content.cloneNode(true));
                this.#setupSelect();
                break;
            default:
                this.shadowRoot.append(textTemplate.content.cloneNode(true));
                type = "text";
                return;
        }

        this.#type = type;
    }

    #setupSelect() {
        let listAttr = this.getAttribute("list");
        const selectElement = this.shadowRoot.querySelector("select");

        if (listAttr) {
            let list = listAttr.split(",");

            let listElements = list.map((type, i) => {
                let optionElement = document.createElement("option");
                optionElement.value = `${i}`;
                optionElement.textContent = type;
                return optionElement;
            });

            selectElement.append(...listElements);
        }

        this.value = this.getAttribute("value") ?? 0;
    }

    get value() {
        return this.shadowRoot.querySelector("input,select").value;
    }

    set value(value) {
        this.shadowRoot.querySelector("input,select").value = value;
    }

    attachListeners() {
        this.#listenerController.abort();
        this.#listenerController = new AbortController();

        this.shadowRoot.addEventListener(
            "input",
            this.#inputHandler.bind(this),
            { signal: this.#listenerController.signal }
        );
    }

    /**@param {HTMLInputEvent} e */
    #inputHandler(e) {
        if (e.target.id == "output") {
            this.value = e.target.value;
            this.#updateOutput();
            return;
        }
        if (this.#type == "range") {
            this.#updateOutput(true);
        }
    }

    #updateOutput(setValue = false) {
        let inputElement = this.inputElement;
        let value = inputElement.value;
        let min = inputElement.min;
        let max = inputElement.max;

        let normalValue = (+value - +min) / (Math.abs(+min) + +max);

        /**@type {HTMLInputElement} */
        let outputInput = this.shadowRoot.getElementById("output");
        outputInput.style.left = `${normalValue * 100}%`;
        outputInput.style.width = `${value.length + 0.5}ch`;
        if (setValue) {
            outputInput.value = `${value}`;
        }
    }
}
