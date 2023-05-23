package edu.scu.studentvotingportal.dto;

import edu.scu.studentvotingportal.entity.Candidates;
import edu.scu.studentvotingportal.entity.Positions;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class VotePositionResp {
    Long id;
    Long electionId;
    String positionName;
    @Builder.Default
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
