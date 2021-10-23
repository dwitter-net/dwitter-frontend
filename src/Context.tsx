import React from 'react';
import { LoggedInUser } from './api';

interface Theme {
  key: string;
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
  primary: string;
  switchOffBackgroundColor: string;
  primaryBackgroundTint: string;
  primaryTextTint: string;
}

const darkPrimary = (brightness: number) => `hsl(205, 32%, ${brightness}%)`;

export const themes: { [key: string]: Theme } = {
  light: {
    key: 'light',
    mainTextColor: '#000',
    pageBackgroundColor: '#f5f5f5',
    headerBackgroundColor: '#fff',
    mainBackgroundColor: '#fff',
    secondaryBackgroundColor: '#eee',
    secondaryTextColor: '#222',
    secondaryBorderColor: '#aaa',
    codeEditorBackgroundColor: '#222',
    focusedTextInputBackgroundColor: '#fff',
    focusedTextInputTextColor: '#000',
    modalBackgroundColor: '#fff',
    primary: '#007bff',
    switchOffBackgroundColor: '#666',
  },
  dark: {
    key: 'dark',
    mainTextColor: '#eee',
    pageBackgroundColor: darkPrimary(10),
    headerBackgroundColor: '#000',
    mainBackgroundColor: darkPrimary(18),
    secondaryBackgroundColor: darkPrimary(13),
    secondaryTextColor: '#888',
    secondaryBorderColor: darkPrimary(13),
    codeEditorBackgroundColor: darkPrimary(13),
    focusedTextInputBackgroundColor: '#222',
    focusedTextInputTextColor: '#fff',
    modalBackgroundColor: darkPrimary(10),
    primary: '#007bff',
    switchOffBackgroundColor: '#666',
  },
};

export const topBarMaxWidth = 960;
export const pageMaxWidth = 600 + 32;

export interface AppContext {
  theme: Theme;
  user: LoggedInUser | null;
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
