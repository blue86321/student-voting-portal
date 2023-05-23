package edu.scu.studentvotingportal.service;

import edu.scu.studentvotingportal.dto.UserLoginResp;
import edu.scu.studentvotingportal.dto.UserParams;
import edu.scu.studentvotingportal.dto.UserResp;

import java.util.List;


public interface UserService {

    UserLoginResp register(UserParams userParams);

    UserResp getUserInfo(Long sourceUserId, Long targetUserId);

    UserResp modifyUserInfo(Long sourceUserId, Long targetUserId, UserParams userParams,
                            boolean partial);

    List<UserResp> getUsers(Long sourceUserId);

    void deleteUser(Long sourceUserId, Long targetUserId);

}
