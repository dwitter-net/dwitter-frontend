import React from "react";
import { User } from "./api";

interface Theme {
  pageBackgroundColor: string;
  mainTextColor: string;
  headerBackgroundColor: string;
  mainBackgroundColor: string;
  secondaryBackgroundColor: string;
  secondaryTextColor: string;
  secondaryBorderColor: string;
  codeEditorBackgroundColor: string;
  focusedTextInputBackgroundColor: string;
  focusedTextInputTextColor: string;
  modalBackgroundColor: string;
}

export const themes: { [key: string]: Theme } = {
  light: {
    mainTextColor: "#000",
    pageBackgroundColor: "#f5f5f5",
    headerBackgroundColor: "#fff",
    mainBackgroundColor: "#fff",
    secondaryBackgroundColor: "#eee",
    secondaryTextColor: "#222",
    secondaryBorderColor: "#aaa",
    codeEditorBackgroundColor: "#222",
    focusedTextInputBackgroundColor: "#fff",
    focusedTextInputTextColor: "#000",
    modalBackgroundColor: "#fff",
  },
  dark: {
    mainTextColor: "#eee",
    pageBackgroundColor: "#292929",
    headerBackgroundColor: "#000",
    mainBackgroundColor: "#000",
    secondaryBackgroundColor: "#151515",
    secondaryTextColor: "#888",
    secondaryBorderColor: "#333",
    codeEditorBackgroundColor: "#151515",
    focusedTextInputBackgroundColor: "#222",
    focusedTextInputTextColor: "#fff",
    modalBackgroundColor: "#292929",
  },
};

export const pageMaxWidth = 600 + 32;

export interface AppContext {
  theme: Theme;
  user: User | null;
  requireLogin: (options: {
    reason: string;
    nextAction: string;
  }) => Promise<any>;
}

type AppContextSetter = (partial: Partial<AppContext>) => void;

export type AppContextPair = [AppContext, AppContextSetter];

export const Context = React.createContext<AppContextPair>([
  { user: null, requireLogin: async () => 0, theme: themes.dark },
  () => 0,
]);
