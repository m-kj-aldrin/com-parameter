let inputResetText = await (await fetch("/src/style/input_reset.css")).text();
let inputResetStyleSheet = new CSSStyleSheet();
inputResetStyleSheet.replaceSync(inputResetText);

const template = document.createElement("template");
template.innerHTML = `
`;

const rangeTemplate = document.createElement("template");
rangeTemplate.innerHTML = `
<input type="range" />
`;

const numberTemplate = document.createElement("template");
numberTemplate.innerHTML = `
<input type="number" />
`;

const textTemplate = document.createElement("template");
textTemplate.innerHTML = `
<input type="text" />
`;

export class CustomInput extends HTMLElement {
  #listenerController = new AbortController();
  #type = "text";

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

    let inputElement = this.inputElement;

    inputElement.min = min;
    inputElement.max = max;
    inputElement.step = step;
    inputElement.value = value;
  }

  /**@param {string} type */
  #setType(type) {
    switch (type) {
      case "range":
        this.shadowRoot.append(rangeTemplate.content.cloneNode(true));
        break;
      case "number":
        this.shadowRoot.append(numberTemplate.content.cloneNode(true));
        break;
      default:
        this.shadowRoot.append(textTemplate.content.cloneNode(true));
        return;
    }

    this.#type = type;
  }

  get value() {
    return this.shadowRoot.querySelector("input").value;
  }

  set value(value) {
    this.shadowRoot.querySelector("input").value = value;
  }

  attachListeners() {
    this.#listenerController.abort();
    this.#listenerController = new AbortController();

    this.shadowRoot.addEventListener(
      "input",
      (e) => {
        this.dispatchEvent(new InputEvent("input"));
      },
      { signal: this.#listenerController.signal }
    );

    this.shadowRoot.addEventListener("input", this.#inputHandler.bind(this));
  }

  /**@param {HTMLInputEvent} e */
  #inputHandler(e) {
    let value = e.target.value;
    let min = e.target.min;
    let max = e.target.max;

    let normalValue = (+value - +min) / (Math.abs(+min) + +max);

    e.target.style.setProperty("--number-value", `'${normalValue}'`);
    e.target.style.setProperty("--norm-value", `${normalValue}`);
  }
}
