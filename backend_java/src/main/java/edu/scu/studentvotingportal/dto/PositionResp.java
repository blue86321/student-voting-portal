package edu.scu.studentvotingportal.dto;

import java.util.List;
import java.util.stream.Collectors;

import edu.scu.studentvotingportal.entity.Candidates;
import edu.scu.studentvotingportal.entity.Positions;
import lombok.Data;

@Data
public class PositionResp {
    Long id;
    Long electionId;
    String positionName;
    String positionDesc = "";
    Integer maxVotesTotal;
    Integer maxVotesPerCandidate;
    Integer totalVoteCount;

    List<CandidateResp> candidates;

    public PositionResp(Positions positions, List<Candidates> candidates) {
        this.id = positions.getId();
        this.electionId = positions.getElection().getId();
        this.positionName = positions.getPositionName();
        this.positionDesc = positions.getPositionDesc();
        this.maxVotesTotal = positions.getMaxVotesTotal();
        this.maxVotesPerCandidate = positions.getMaxVotesPerCandidate();
        this.totalVoteCount = candidates.stream().mapToInt(Candidates::getVoteCount).sum();
        this.candidates = candidates.stream().map(CandidateResp::new).collect(Collectors.toList());
    }
}
