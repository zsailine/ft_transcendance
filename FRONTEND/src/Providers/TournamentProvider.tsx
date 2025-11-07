import { createContext } from "react";

interface UserContextType {
  aliases: string[];
  setAliases: (value: string[]) => void;
  pages: number;
  setPages: (value: number) => void;
}

export const UserContext = createContext<UserContextType>({
  aliases: [],
  setAliases: () => {},
  pages: 0,
  setPages: () => {}
});