import { CustomInput } from "./src/custom-elements/input";
import { ModuleElement } from "./src/custom-elements/module";
import { ParameterElement } from "./src/custom-elements/parameter";

declare global {
  interface HTMLElementTagNameMap {
    "com-module": ModuleElement;
    "com-parameter": ParameterElement;
    "com-input": CustomInput;
  }

  interface HTMLInputEvent extends InputEvent {
    target: HTMLInputElement;
  }

  interface SlotEvent extends Event {
    target: HTMLSlotElement;
  }

  interface HTMLEvent extends Event {
    target: HTMLElement;
  }
}
