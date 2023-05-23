package edu.scu.studentvotingportal.service;

import edu.scu.studentvotingportal.dto.PositionParams;
import edu.scu.studentvotingportal.dto.PositionResp;
import edu.scu.studentvotingportal.entity.Users;

import java.util.List;


public interface PositionService {

    PositionResp getPositionInfoById(Long positionId);

    List<PositionResp> getAllPositionInfo();

    PositionResp createPosition(PositionParams positionParams, Users sourceUser);

    PositionResp modifyPosition(Long sourceUserId, Long positionId, PositionParams positionParams, boolean partial);

    void deletePosition(Long userId, Long electionId);
}
