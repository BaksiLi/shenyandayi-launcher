import React, { useState } from "react";
import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Icon,
  List,
  open,
  showToast,
  Toast,
} from "@raycast/api";
import { constructSearchUrl, convertToSimplified } from "./search";
import type { Preferences, SearchType } from "./types";

const labels = {
  words: {
    title: "尋詞",
    placeholder: "輸入意思、情境或英文描述，尋找貼切的詞語…",
    emptyTitle: "想找哪一個詞？",
    description: "描述意思或情境，再按 Enter 開啟深言達意尋詞。",
  },
  quotes: {
    title: "覓句",
    placeholder: "輸入主題、情境或意境，尋找詩詞與佳句…",
    emptyTitle: "想找怎樣的句子？",
    description: "輸入主題或意境，再按 Enter 開啟深言達意覓句。",
  },
};

export default function SearchCommand({ type }: { type: SearchType }) {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { useSystemOpencc = true } = getPreferenceValues<Preferences>();
  const query = searchText.trim();
  const text = labels[type];

  async function handleSearch() {
    if (!query || isLoading) return;

    setIsLoading(true);
    try {
      const converted = convertToSimplified(query, useSystemOpencc);
      await open(constructSearchUrl(converted, type));
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "搜尋失敗",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={text.placeholder}
      filtering={false}
    >
      {query ? (
        <List.Item
          title={query}
          subtitle={`在深言達意${text.title}`}
          icon={Icon.MagnifyingGlass}
          actions={
            <ActionPanel>
              <Action
                title={`開啟${text.title}`}
                icon={Icon.Globe}
                onAction={handleSearch}
              />
            </ActionPanel>
          }
        />
      ) : (
        <List.EmptyView
          title={text.emptyTitle}
          description={text.description}
          icon={Icon.MagnifyingGlass}
        />
      )}
    </List>
  );
}
