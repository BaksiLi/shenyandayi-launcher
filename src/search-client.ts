import { readSearchPage } from "swift:../swift";
import { constructSearchUrl } from "./search";
import type { SearchResult, SearchType } from "./types";

type SearchErrorKind =
  | "access"
  | "timeout"
  | "network"
  | "service"
  | "renderer";

type PageResponse =
  | {
      status: "results";
      results: Pick<SearchResult, "text" | "author" | "work">[];
    }
  | { status: "empty" | "pending" }
  | { status: Exclude<SearchErrorKind, "renderer">; httpStatus?: number };

export class SearchError extends Error {
  constructor(
    public readonly kind: SearchErrorKind,
    public readonly httpStatus?: number,
  ) {
    super(kind);
    this.name = "SearchError";
  }
}

export async function fetchSearchResults(
  query: string,
  type: SearchType,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  signal.throwIfAborted();
  const response: PageResponse = await readSearchPage(
    constructSearchUrl(query, type),
  ).catch(() => {
    throw new SearchError("renderer");
  });
  signal.throwIfAborted();

  switch (response.status) {
    case "results":
      return response.results.map((result, index) => ({
        id: `${type}:${index}`,
        type,
        text: result.text,
        author: result.author ?? undefined,
        work: result.work ?? undefined,
      }));
    case "empty":
      return [];
    case "access":
    case "network":
    case "service":
    case "timeout":
      throw new SearchError(response.status, response.httpStatus ?? undefined);
    default:
      throw new SearchError("renderer");
  }
}
