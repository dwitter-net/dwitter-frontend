import React from "react";
import { User } from "./api";

export interface AppContext {
  user: User | null;
}

type AppContextSetter = (partial: Partial<AppContext>) => void;

export type AppContextPair = [AppContext, AppContextSetter];

export const Context = React.createContext<AppContextPair>([
  { user: null },
  () => 0,
]);
