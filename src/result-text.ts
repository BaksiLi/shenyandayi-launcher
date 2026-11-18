import type { SearchResult } from "./types";

export function resultAttribution(result: SearchResult): string {
  const work = result.work
    ? /^《.*》$/.test(result.work)
      ? result.work
      : `《${result.work}》`
    : undefined;
  return [result.author, work].filter(Boolean).join(" ");
}

export function resultCitation(result: SearchResult): string {
  const attribution = resultAttribution(result);
  return attribution ? `${result.text}\n——${attribution}` : result.text;
}

export function resultMarkdown(result: SearchResult): string {
  return result.text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/([\\`*_{}[\]()#+.!|~-])/g, "\\$1")
    .replace(/\r?\n/g, "\n\n");
}
