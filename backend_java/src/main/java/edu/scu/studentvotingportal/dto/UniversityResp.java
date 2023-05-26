package edu.scu.studentvotingportal.dto;

import edu.scu.studentvotingportal.entity.University;
import lombok.Data;

@Data
public class UniversityResp {
    Long id;
    String name;

    UniversityResp(University university) {
        this.id = university.getId();
        this.name = university.getName();
    }
}
