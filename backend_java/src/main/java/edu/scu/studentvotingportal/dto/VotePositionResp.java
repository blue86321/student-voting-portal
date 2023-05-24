package edu.scu.studentvotingportal.dto;

import edu.scu.studentvotingportal.entity.Positions;
import lombok.Data;

@Data
public class VotePositionResp {
    Long id;
    Long electionId;
    String positionName;
    String positionDesc = "";
    Integer maxVotesTotal;
    Integer maxVotesPerCandidate;

    public VotePositionResp(Positions positions) {
        this.id = positions.getId();
        this.electionId = positions.getElection().getId();
        this.positionName = positions.getPositionName();
        this.positionDesc = positions.getPositionDesc();
        this.maxVotesTotal = positions.getMaxVotesTotal();
        this.maxVotesPerCandidate = positions.getMaxVotesPerCandidate();
    }
}
