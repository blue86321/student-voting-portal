package edu.scu.studentvotingportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class CandidateParams {
    Long electionId;
    Long positionId;
    String candidateName;
    @Builder.Default
    String candidateDesc = "";
    @Builder.Default
    String photoUrl = "";
}
