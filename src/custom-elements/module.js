const template = document.createElement("template");
template.innerHTML = `
<slot></slot>
`;

export class ModuleElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.append(template.content.cloneNode(true));
  }
}
