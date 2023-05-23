package edu.scu.studentvotingportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.scu.studentvotingportal.entity.Users;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.util.Date;

@Data
public class UserLoginResp {
    Long id;
    String email;
    UniversityResp university;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    Date dob;

    boolean isStaff;

    boolean isSuperuser;

    Token token;

    public UserLoginResp(Users user, String access_token, String refresh_token) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.university = new UniversityResp(user.getUniversity());
        this.dob = user.getDob();
        this.isStaff = user.isStaff();
        this.isSuperuser = user.isSuperuser();
        this.token = new Token(access_token, refresh_token);
    }

    @Data
    static class Token {
        String access;
        String refresh;

        public Token(String access, String refresh) {
            this.access = access;
            this.refresh = refresh;
        }
    }
}
