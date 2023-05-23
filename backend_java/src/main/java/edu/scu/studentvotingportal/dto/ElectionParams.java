package edu.scu.studentvotingportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class ElectionParams {
    Long universityId;

    String electionName;

    @Builder.Default
    String electionDesc = "";

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    Date startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    Date endTime;

}
