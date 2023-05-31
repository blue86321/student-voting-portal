package edu.scu.studentvotingportal.dto;


import edu.scu.studentvotingportal.entity.Candidates;
import lombok.Data;

@Data
public class CandidateResp {
    Long id;
    Long electionId;
    Long positionId;
    Integer voteCount;
    String candidateName;
    String candidateDesc;
    String photoUrl;

    public CandidateResp(Candidates candidates) {
        this.id = candidates.getId();
        this.electionId = candidates.getElection().getId();
        this.positionId = candidates.getPosition().getId();
        this.voteCount = candidates.getVoteCount();
        this.candidateName = candidates.getCandidateName();
        this.candidateDesc = candidates.getCandidateDesc();
        this.photoUrl = candidates.getPhotoUrl();
    }
}
