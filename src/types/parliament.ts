export type VoteType = "agree" | "disagree" | "abstain" | "absent";

export interface MP {
  id: string;
  firstName: string;
  lastName: string;
  party: string;
  type: "constituency" | "party-list";
  district?: string;
  vote: VoteType;
}

export interface Bill {
  id: string;
  name: string;
  date: string;
  description: string;
}

export interface VoteSummary {
  agree: number;
  disagree: number;
  abstain: number;
  absent: number;
  total: number;
}
