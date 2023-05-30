import Logger from "../component/utils/Logger";
import { CandidateDetail, PositionDetail } from "./Interfaces/Election";

class Position implements PositionDetail {
    id: number;
    electionId: number;
    positionName: string;
    positionDesc: string;
    maxVotesTotal: number;
    maxVotesPerCandidate: number;
    totalVoteCount: number;
    candidates: CandidateDetail[];

    constructor(p: PositionDetail) {
        this.id = p.id;
        this.electionId = p.electionId;
        this.positionName = p.positionName;
        this.positionDesc = p.positionDesc;
        this.maxVotesTotal = p.maxVotesTotal;
        this.maxVotesPerCandidate = p.maxVotesPerCandidate
        this.totalVoteCount = p.totalVoteCount
        this.candidates = p.candidates;
    }

    isDataCompleted(): boolean {
      Logger.debug('[PositionModel] candidates', this.candidates);
      return this.candidates.length > 0;
    }
}

export class PositionVote extends Position {
  selectedCandidate: string = "";
}

export default Position;