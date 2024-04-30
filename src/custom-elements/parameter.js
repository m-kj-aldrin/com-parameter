import { CustomInput } from "./input.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  :host{
    display: block;
  }
</style>
<slot></slot>
`;

export class ParameterElement extends HTMLElement {
  #order = 0;
  #listenerController = new AbortController();

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.append(template.content.cloneNode(true));

    if (this.hasAttribute("order")) {
      this.order = parseInt(this.getAttribute("order"));
    } else {
      this.order = -1;
    }

    this.#attachListeners();
  }

  #attachListeners() {
    this.#listenerController.abort();
    this.#listenerController = new AbortController();

    this.addEventListener("input", this.#inputHandler.bind(this), {
      signal: this.#listenerController.signal,
    });

    this.shadowRoot.addEventListener(
      "slotchange",
      this.#slotHandler.bind(this)
    );
  }

  /**@param {HTMLInputEvent} e */
  #inputHandler(e) {
    e.stopPropagation();
    this.#signal();
  }

  /**@param {SlotEvent} e */
  #slotHandler(e) {
    for (const element of e.target.assignedElements({ flatten: true })) {
      if (!(element instanceof CustomInput)) {
        console.error(
          "Only 'com-input' elements are allowed inside a 'com-parameter'",
          this
        );
        element.remove();
      }
    }
  }

  #signal() {
    let cidx = 0;
    let midx = 0;
    let pidx = this.#order;
    let value = this.value;

    let signalString = `parameter -m ${cidx}:${midx} -v ${pidx}:${value}`;

    console.log(signalString);
  }

  get value() {
    return this.querySelector("com-input").value;
  }

  set value(value) {
    this.querySelector("com-input").value = value;
  }

  set order(order) {
    if (typeof order == "number") {
      this.#order = order;
    } else {
      this.#order = -1;
    }
  }

  get order() {
    return this.#order;
  }
}
