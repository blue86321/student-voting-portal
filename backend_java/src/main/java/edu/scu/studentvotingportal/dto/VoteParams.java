package edu.scu.studentvotingportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class VoteParams {
    Long electionId;
    List<VoteInfo> votes;

    @Data
    @Builder(toBuilder = true)
    @AllArgsConstructor
    @NoArgsConstructor
    static public class VoteInfo {
        Long positionId;
        List<CandidateInfo> candidates;
    }

    @Data
    @Builder(toBuilder = true)
    @AllArgsConstructor
    @NoArgsConstructor
    static public class CandidateInfo {
        Long candidateId;
        Integer voteCount;
    }
}
