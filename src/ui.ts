import { getPreferenceValues } from "@raycast/api";
import english from "./ui-text.json";
import traditional from "./locales/zh-Hant.json";
import simplified from "./locales/zh-Hans.json";

export type InterfaceText = typeof english;

export function getInterfaceText(): InterfaceText {
  const { interfaceLanguage = "en-US" } = getPreferenceValues<{
    interfaceLanguage?: string;
  }>();
  if (interfaceLanguage === "zh-Hant") return traditional;
  if (interfaceLanguage === "zh-Hans") return simplified;
  return english;
}
