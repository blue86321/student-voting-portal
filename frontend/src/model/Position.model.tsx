import { CandidateDetail, PositionDetail } from "../Interfaces/Election";

class Position implements PositionDetail{
    id: number;
    electionId: number;
    positionName: string;
    positionDesc: string;
    maxVotesTotal: number;
    maxVotesPerCandidate: number;
    candidates: CandidateDetail[];

    constructor(p: PositionDetail) {
        this.id = p.id;
        this.electionId = p.electionId;
        this.positionName = p.positionName;
        this.positionDesc = p.positionDesc;
        this.maxVotesTotal = p.maxVotesTotal;
        this.maxVotesPerCandidate = p.maxVotesPerCandidate
        this.candidates = p.candidates;
    }

    isDataCompleted(): boolean {
      return this.candidates.length > 0;
    }
}

export default Position;