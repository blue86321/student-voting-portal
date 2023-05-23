package edu.scu.studentvotingportal.service;

import edu.scu.studentvotingportal.dto.CandidateParams;
import edu.scu.studentvotingportal.dto.CandidateResp;
import edu.scu.studentvotingportal.entity.Users;

import java.util.List;


public interface CandidateService {

    CandidateResp getCandidateInfoById(Long candidateId);

    List<CandidateResp> getAllCandidateInfo();

    CandidateResp createCandidate(CandidateParams candidateParams, Users sourceUser);

    CandidateResp modifyCandidate(Long sourceUserId, Long candidateId, CandidateParams candidateParams, boolean partial);

    void deleteCandidate(Long userId, Long electionId);
}
