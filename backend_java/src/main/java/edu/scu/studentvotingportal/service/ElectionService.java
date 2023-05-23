package edu.scu.studentvotingportal.service;

import edu.scu.studentvotingportal.dto.ElectionParams;
import edu.scu.studentvotingportal.dto.ElectionResp;
import edu.scu.studentvotingportal.entity.Users;

import java.util.List;


public interface ElectionService {

    ElectionResp getElectionInfoById(Long electionId);

    List<ElectionResp> getAllElectionInfo();

    ElectionResp createElection(ElectionParams electionParams, Users sourceUser);

    ElectionResp modifyElection(Long sourceUserId, Long electionId, ElectionParams electionParams, boolean partial);

    void deleteElection(Long userId, Long electionId);
}
