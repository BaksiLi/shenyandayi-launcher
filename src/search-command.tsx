import React, { useEffect, useRef, useState } from "react";
import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Icon,
  List,
  openExtensionPreferences,
} from "@raycast/api";
import { constructSearchUrl, convertToSimplified } from "./search";
import { fetchSearchResults, SearchError } from "./search-client";
import {
  resultAttribution,
  resultCitation,
  resultMarkdown,
} from "./result-text";
import { getInterfaceText } from "./ui";
import type { Preferences, SearchResult, SearchType } from "./types";

type SearchState =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "success"; query: string; results: SearchResult[] }
  | { status: "error"; query: string; error: SearchError };

export default function SearchCommand({ type }: { type: SearchType }) {
  const [searchText, setSearchText] = useState("");
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const activeRequest = useRef<AbortController | undefined>(undefined);
  const { useSystemOpencc = true } = getPreferenceValues<Preferences>();
  const labels = getInterfaceText();
  const query = searchText.trim();
  const converted = convertToSimplified(query, useSystemOpencc);
  const submittedQuery = state.status === "idle" ? converted : state.query;
  const text = labels[type];
  const results = state.status === "success" ? state.results : [];

  useEffect(() => () => activeRequest.current?.abort(), []);

  function handleTextChange(value: string) {
    activeRequest.current?.abort();
    activeRequest.current = undefined;
    setSearchText(value);
    setState({ status: "idle" });
  }

  async function handleSearch() {
    if (!query || activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    setState({ status: "loading", query: converted });
    try {
      const found = await fetchSearchResults(
        converted,
        type,
        controller.signal,
      );
      if (activeRequest.current === controller && !controller.signal.aborted) {
        setState({ status: "success", query: converted, results: found });
      }
    } catch (error) {
      if (activeRequest.current === controller && !controller.signal.aborted) {
        setState({
          status: "error",
          query: converted,
          error:
            error instanceof SearchError ? error : new SearchError("renderer"),
        });
      }
    } finally {
      if (activeRequest.current === controller)
        activeRequest.current = undefined;
    }
  }

  function searchActions(result?: SearchResult) {
    return (
      <ActionPanel>
        {result ? (
          <Action.CopyToClipboard
            title={labels.search.copyResult}
            content={result.text}
          />
        ) : (
          <Action
            title={state.status === "idle" ? text.search : labels.search.retry}
            icon={Icon.MagnifyingGlass}
            onAction={handleSearch}
          />
        )}
        {result && resultAttribution(result) ? (
          <Action.CopyToClipboard
            title={labels.search.copyCitation}
            content={resultCitation(result)}
          />
        ) : null}
        <Action.OpenInBrowser
          title={text.open}
          url={constructSearchUrl(submittedQuery, type)}
          shortcut={{ modifiers: ["cmd"], key: "o" }}
        />
        <Action.CopyToClipboard
          title={labels.search.copyQuery}
          content={submittedQuery}
        />
        {result ? (
          <Action
            title={labels.search.retry}
            icon={Icon.MagnifyingGlass}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={handleSearch}
          />
        ) : null}
        {preferencesAction()}
      </ActionPanel>
    );
  }

  function preferencesAction() {
    return (
      <Action
        title={labels.search.preferences}
        icon={Icon.Gear}
        onAction={openExtensionPreferences}
      />
    );
  }

  let emptyTitle = text.emptyTitle;
  let description = text.description;
  if (state.status === "loading") {
    emptyTitle = labels.search.searching;
    description = labels.search.waiting;
  } else if (state.status === "error") {
    emptyTitle = labels.search.failed;
    description = labels.errors[state.error.kind];
    if (state.error.httpStatus !== undefined) {
      description += ` ${labels.search.httpStatus}${state.error.httpStatus}`;
    }
  } else if (state.status === "success" && !results.length) {
    emptyTitle = labels.search.noResults;
    description = labels.search.tryAnother;
  }

  return (
    <List
      navigationTitle={text.title}
      isLoading={state.status === "loading"}
      searchText={searchText}
      onSearchTextChange={handleTextChange}
      searchBarPlaceholder={text.placeholder}
      filtering={false}
      isShowingDetail={type === "quotes" && results.length > 0}
    >
      {state.status === "idle" && query ? (
        <List.Item
          title={query}
          subtitle={
            converted === query
              ? text.subtitle
              : `${labels.search.convertedQuery}${converted}`
          }
          icon={Icon.MagnifyingGlass}
          actions={searchActions()}
        />
      ) : results.length > 0 ? (
        <List.Section
          title={labels.search.results}
          subtitle={
            submittedQuery === query
              ? query
              : `${labels.search.convertedQuery}${submittedQuery}`
          }
        >
          {results.map((result) => (
            <List.Item
              key={result.id}
              title={result.text}
              subtitle={resultAttribution(result)}
              icon={type === "words" ? Icon.Text : Icon.QuotationMarks}
              detail={
                type === "quotes" ? (
                  <List.Item.Detail
                    markdown={resultMarkdown(result)}
                    metadata={
                      <List.Item.Detail.Metadata>
                        {result.author ? (
                          <List.Item.Detail.Metadata.Label
                            title={labels.search.author}
                            text={result.author}
                          />
                        ) : null}
                        {result.work ? (
                          <List.Item.Detail.Metadata.Label
                            title={labels.search.work}
                            text={result.work}
                          />
                        ) : null}
                        <List.Item.Detail.Metadata.Link
                          title={labels.search.provider}
                          text="Shenyandayi"
                          target={constructSearchUrl(submittedQuery, type)}
                        />
                        <List.Item.Detail.Metadata.Label
                          title={labels.search.query}
                          text={submittedQuery}
                        />
                      </List.Item.Detail.Metadata>
                    }
                  />
                ) : undefined
              }
              actions={searchActions(result)}
            />
          ))}
        </List.Section>
      ) : (
        <List.EmptyView
          title={emptyTitle}
          description={description}
          icon={
            state.status === "error"
              ? Icon.ExclamationMark
              : Icon.MagnifyingGlass
          }
          actions={
            query ? (
              searchActions()
            ) : (
              <ActionPanel>{preferencesAction()}</ActionPanel>
            )
          }
        />
      )}
    </List>
  );
}
