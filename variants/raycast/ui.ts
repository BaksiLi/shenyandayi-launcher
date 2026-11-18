import text from "./ui-text.json";

export type InterfaceText = typeof text;

export function getInterfaceText(): InterfaceText {
  return text;
}
