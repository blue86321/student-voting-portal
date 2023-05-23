package edu.scu.studentvotingportal.service;


import edu.scu.studentvotingportal.dto.UserLoginParams;
import edu.scu.studentvotingportal.dto.UserLoginResp;

public interface AuthService {

    UserLoginResp login(UserLoginParams params);
}
