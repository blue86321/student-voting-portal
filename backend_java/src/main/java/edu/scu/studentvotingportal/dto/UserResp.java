package edu.scu.studentvotingportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.scu.studentvotingportal.entity.Users;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.util.Date;

@Data
public class UserResp {
    Long id;
    String email;
    UniversityResp university;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    Date dob;
    boolean isStaff;

    boolean isSuperuser;

    public UserResp(Users user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.university = new UniversityResp(user.getUniversity());
        this.dob = user.getDob();
        this.isStaff = user.isStaff();
        this.isSuperuser = user.isSuperuser();
    }
}
