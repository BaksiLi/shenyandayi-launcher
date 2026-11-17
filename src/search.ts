import { Converter } from "opencc-js/t2cn";
import type { SearchType } from "./types";

let converter: ReturnType<typeof Converter> | undefined;

export function convertToSimplified(text: string, enabled = true): string {
  if (!enabled) return text;

  converter ??= Converter({ from: "t", to: "cn" });
  return converter(text);
}

export function constructSearchUrl(query: string, type: SearchType): string {
  const endpoint = type === "words" ? "wantWordsResult" : "wantQuotesResult";
  return `https://www.shenyandayi.com/${endpoint}?lang=zh&query=${encodeURIComponent(query)}`;
}
