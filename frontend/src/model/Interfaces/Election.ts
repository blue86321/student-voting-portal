import { University } from "./User";

export interface Vote {
  electionId: number;
  votes: VotePosition[];
}

export interface VotePosition {
  positionId: number;
  candidates: VoteCandidate[];
}

export interface VoteCandidate {
  candidateId: number;
  voteCount: number;
}

// returned from getVotes
export interface VoteDetail {
  election: ElectionDetail;
  votes: VotePositionDetail[];
}

export interface VotePositionDetail {
  position: PositionDetail;
  candidates: VoteCandidateDetail[];
}

export interface VoteCandidateDetail {
  candidate: CandidateDetail;
  voteCount: number;
}

export interface Candidate {
  electionId: number;
  positionId: number;
  candidateName: string;
  candidateDesc: string;
  photoUrl: string;
}

export interface Election {
  universityId: number;
  electionName: string;
  electionDesc: string;
  startTime: Date;
  endTime: Date;
}

export interface Position {
  electionId: number;
  positionName: string;
  positionDesc: string;
  maxVotesTotal: number;
  maxVotesPerCandidate: number;
}

export interface ElectionDetail {
  id: number;
  positions: PositionDetail[];
  university: University;
  electionName: string;
  electionDesc: string;
  startTime: string;
  endTime: string;
}

export interface PositionDetail {
  id: number;
  electionId: number;
  positionName: string;
  positionDesc: string;
  maxVotesTotal: number;
  maxVotesPerCandidate: number;
  totalVoteCount: number;
  candidates: CandidateDetail[];
}

export interface CandidateDetail {
  id: number;
  electionId: number;
  positionId: number;
  voteCount: number;
  candidateName: string;
  candidateDesc: string;
  photoUrl: string;
  // election result
  winner?: boolean;
  votePercentage?: number;
}