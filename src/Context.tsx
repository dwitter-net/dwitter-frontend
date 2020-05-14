import React from "react";
import { User } from "./api";

export interface AppContext {
  user: User | null;
  requireLogin: (options: {
    reason: string;
    nextAction: string;
  }) => Promise<any>;
}

type AppContextSetter = (partial: Partial<AppContext>) => void;

export type AppContextPair = [AppContext, AppContextSetter];

export const Context = React.createContext<AppContextPair>([
  { user: null, requireLogin: async () => 0 },
  () => 0,
]);
