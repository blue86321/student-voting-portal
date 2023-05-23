package edu.scu.studentvotingportal.dto;

import edu.scu.studentvotingportal.entity.Candidates;
import edu.scu.studentvotingportal.entity.Positions;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class PositionResp {
    Long id;
    Long electionId;
    String positionName;
    @Builder.Default
    String positionDesc = "";
    Integer maxVotesTotal;
    Integer maxVotesPerCandidate;

    List<CandidateResp> candidates;

    public PositionResp(Positions positions, List<Candidates> candidates) {
        this.id = positions.getId();
        this.electionId = positions.getElection().getId();
        this.positionName = positions.getPositionName();
        this.positionDesc = positions.getPositionDesc();
        this.maxVotesTotal = positions.getMaxVotesTotal();
        this.maxVotesPerCandidate = positions.getMaxVotesPerCandidate();
        this.candidates = candidates.stream().map(CandidateResp::new).collect(Collectors.toList());
    }
}
