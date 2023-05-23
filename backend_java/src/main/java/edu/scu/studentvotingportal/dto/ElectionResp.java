package edu.scu.studentvotingportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.scu.studentvotingportal.entity.Elections;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ElectionResp {
    Long id;
    List<PositionResp> positions;
    UniversityResp university;
    String electionName;
    String electionDesc;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    @Temporal(TemporalType.TIMESTAMP)
    Date startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    @Temporal(TemporalType.TIMESTAMP)
    Date endTime;


    public ElectionResp(Elections election, List<PositionResp> positionRespList) {
        this.id = election.getId();
        this.university = new UniversityResp(election.getUniversity());
        this.positions = positionRespList;
        this.electionName = election.getElectionName();
        this.electionDesc = election.getElectionDesc();
        this.startTime = election.getStartTime();
        this.endTime = election.getEndTime();
    }
}
