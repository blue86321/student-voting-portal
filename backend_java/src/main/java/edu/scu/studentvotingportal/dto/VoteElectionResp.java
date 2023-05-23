package edu.scu.studentvotingportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.scu.studentvotingportal.entity.Elections;
import edu.scu.studentvotingportal.entity.Positions;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class VoteElectionResp {
    Long id;
    UniversityResp university;
    String electionName;
    String electionDesc;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    @Temporal(TemporalType.TIMESTAMP)
    Date startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    @Temporal(TemporalType.TIMESTAMP)
    Date endTime;


    public VoteElectionResp(Elections elections) {
        this.id = elections.getId();
        this.university = new UniversityResp(elections.getUniversity());
        this.electionName = elections.getElectionName();
        this.electionDesc = elections.getElectionDesc();
        this.startTime = elections.getStartTime();
        this.endTime = elections.getEndTime();
    }
}
