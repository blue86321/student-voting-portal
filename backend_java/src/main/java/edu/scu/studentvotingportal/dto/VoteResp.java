package edu.scu.studentvotingportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class VoteResp {
    VoteElectionResp election;
    List<VoteInfo> votes;

    @Data
    @Builder
    static public class VoteInfo {
        VotePositionResp position;
        List<CandidateInfo> candidates;
    }

    @Data
    @Builder
    static public class CandidateInfo {
        CandidateResp candidate;
        Integer voteCount;
    }
}
