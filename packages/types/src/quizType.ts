import type { Team } from "./teamType";

export type Quiz = {
  id: string;
  name: string;
  teams: Team[];
  started: boolean;
}