package edu.scu.studentvotingportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class PositionParams {
    Long electionId;
    String positionName;
    @Builder.Default
    String positionDesc = "";
    Integer maxVotesTotal;
    Integer maxVotesPerCandidate;
}
