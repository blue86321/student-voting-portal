package edu.scu.studentvotingportal.service;

import edu.scu.studentvotingportal.dto.VoteParams;
import edu.scu.studentvotingportal.dto.VoteResp;
import edu.scu.studentvotingportal.entity.Users;

import java.util.List;


public interface VoteService {

    List<VoteResp> getVoteInfo(Long userId);

    List<VoteResp> createVote(VoteParams voteParams, Users user);
}
