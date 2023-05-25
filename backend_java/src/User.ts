export default interface User {
  id: number;
  email: string;
  dob: string;
  staff: boolean;
  superuser: boolean;
}

export interface Token {
  access: string;
  refresh: string;
}

export interface University {
  id: number;
  name: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  token: Token;
  university: University;
}

export interface createUser{
  email: string,
  password: string,
  passwordConfirm: string,
  universityId: number,
  dob: Date,
  admin: Boolean
}

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

export interface Candidate {
  userId: number;
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

