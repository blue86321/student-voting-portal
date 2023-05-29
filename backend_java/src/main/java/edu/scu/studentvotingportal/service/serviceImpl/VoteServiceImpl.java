package edu.scu.studentvotingportal.service.serviceImpl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.scu.studentvotingportal.dto.CandidateResp;
import edu.scu.studentvotingportal.dto.VoteElectionResp;
import edu.scu.studentvotingportal.dto.VoteParams;
import edu.scu.studentvotingportal.dto.VotePositionResp;
import edu.scu.studentvotingportal.dto.VoteResp;
import edu.scu.studentvotingportal.entity.Candidates;
import edu.scu.studentvotingportal.entity.Elections;
import edu.scu.studentvotingportal.entity.Positions;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.entity.Votes;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.exception.PermissionException;
import edu.scu.studentvotingportal.exception.ValidationException;
import edu.scu.studentvotingportal.repository.CandidateRepository;
import edu.scu.studentvotingportal.repository.ElectionRepository;
import edu.scu.studentvotingportal.repository.PositionRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.repository.VoteRepository;
import edu.scu.studentvotingportal.service.VoteService;
import jakarta.transaction.Transactional;

@Service
public class VoteServiceImpl implements VoteService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ElectionRepository electionRepository;
    @Autowired
    PositionRepository positionRepository;
    @Autowired
    CandidateRepository candidateRepository;

    @Autowired
    VoteRepository voteRepository;

    private boolean isBetween(Date start, Date end) {
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime convertedStart = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime convertedEnd = end.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        return currentTime.isAfter(convertedStart) && currentTime.isBefore(convertedEnd);
    }

    @Override
    public List<VoteResp> getVoteInfo(Long userId) {
        List<Votes> votes = voteRepository.findAllByUserId(userId);
        return aggregateVotes(votes);
    }

    private void validateElections(VoteParams voteParams, Users user, Elections election) {
        // check null
        if (voteParams.getElectionId() == null || voteParams.getVotes() == null || voteParams.getVotes().isEmpty()) {
            throw new ValidationException("Parameters are not complete");
        }
        // check time
        if (!isBetween(election.getStartTime(), election.getEndTime())) {
            throw new ValidationException("Election is not started yet or already ended");
        }
        // check university
        if (!election.getUniversity().getId().equals(user.getUniversity().getId())) {
            throw new PermissionException("User can only vote for his/her university elections");
        }
        // check history
        voteRepository
            .findFirstByUserIdAndElectionId(user.getId(), election.getId())
            .ifPresent(votes -> {
                throw new ValidationException("you have voted this election");
            });
    }

    private void validatePositionAndCandidate(Positions position, Candidates candidate, int voteCount) {
        // check `maxVotesPerCandidate`
        if (position.getMaxVotesPerCandidate() < voteCount) {
            throw new ValidationException("`maxVotesPerCandidate` exceeds");
        }
        // check position and candidate
        if (!position.getId().equals(candidate.getPosition().getId())) {
            throw new ValidationException("Candidate and position are not matched");
        }
    }

    @Override
    @Transactional
    public List<VoteResp> createVote(VoteParams voteParams, Users user) {
        if (voteParams.getElectionId() == null) {
            throw new ValidationException("Parameters are not complete");
        }
        Elections election = electionRepository
            .findById(voteParams.getElectionId())
            .orElseThrow(() -> new DataNotExistsException("Election not found"));
        List<Votes> allVotes = new ArrayList<>();

        // validate
        validateElections(voteParams, user, election);

        // create
        for (VoteParams.VoteInfo voteInfo : voteParams.getVotes()) {
            // iterate all position vote
            Positions position = positionRepository
                .findById(voteInfo.getPositionId())
                .orElseThrow(() -> new DataNotExistsException("Position not found"));
            List<Votes> voteForPositionList = new ArrayList<>();
            int positionVoteSum = 0;

            for (VoteParams.CandidateInfo candidateInfo : voteInfo.getCandidates()) {
                // iterate all candidate vote
                Candidates candidate = candidateRepository
                    .findById(candidateInfo.getCandidateId())
                    .orElseThrow(() -> new DataNotExistsException("Candidate not found"));
                Integer voteCount = candidateInfo.getVoteCount();
                positionVoteSum += voteCount;
                Votes vote = new Votes.Builder()
                    .user(user).election(election).position(position)
                    .candidate(candidate).voteCount(voteCount)
                    .build();
                voteForPositionList.add(vote);

                // validate
                validatePositionAndCandidate(position, candidate, voteCount);
            }
            // check `maxVoteTotal` for a position
            if (position.getMaxVotesTotal() < positionVoteSum) {
                throw new ValidationException("`maxVoteTotal` exceeds");
            }
            allVotes.addAll(voteForPositionList);
        }

        // save
        List<Votes> savedVotes = new ArrayList<>();
        for (Votes v : allVotes) {
            savedVotes.add(voteRepository.save(v));
            // increment candidate `voteCount`
            Candidates candidate = v.getCandidate();
            candidate.setVoteCount(candidate.getVoteCount() + v.getVoteCount());
            candidateRepository.save(candidate);
        }

        return aggregateVotes(savedVotes);
    }

    private List<VoteResp> aggregateVotes(List<Votes> votes) {
        Map<Long, Integer> electionIdxMap = new HashMap<>();
        Map<Long, Integer> positionIdxMap = new HashMap<>();
        List<VoteResp> formattedList = new ArrayList<>();
        for (Votes v : votes) {
            if (!electionIdxMap.containsKey(v.getElection().getId())) {
                electionIdxMap.put(v.getElection().getId(), formattedList.size());
                positionIdxMap.put(v.getPosition().getId(), 0);

                VoteResp voteResp = VoteResp
                    .builder()
                    .election(new VoteElectionResp(v.getElection()))
                    .votes(new ArrayList<>(Collections.singletonList(
                        VoteResp.VoteInfo
                            .builder()
                            .position(new VotePositionResp(v.getPosition()))
                            .candidates(
                                new ArrayList<>(Collections.singletonList(
                                    VoteResp.CandidateInfo
                                        .builder()
                                        .candidate(new CandidateResp(v.getCandidate()))
                                        .voteCount(v.getVoteCount())
                                        .build()
                                ))
                            )
                            .build()
                    )))
                    .build();
                formattedList.add(voteResp);
            } else {
                Integer electionIdx = electionIdxMap.get(v.getElection().getId());
                if (!positionIdxMap.containsKey(v.getPosition().getId())) {
                    positionIdxMap.put(v.getPosition().getId(), formattedList.get(electionIdx).getVotes().size());
                    formattedList.get(electionIdx).getVotes().add(
                        VoteResp.VoteInfo
                            .builder()
                            .position(new VotePositionResp(v.getPosition()))
                            .candidates(
                                new ArrayList<>(Collections.singletonList(
                                    VoteResp.CandidateInfo
                                        .builder()
                                        .candidate(new CandidateResp(v.getCandidate()))
                                        .voteCount(v.getVoteCount())
                                        .build()
                                )
                                ))
                            .build()
                    );
                } else {
                    Integer positionIdx = positionIdxMap.get(v.getPosition().getId());
                    formattedList.get(electionIdx).getVotes().get(positionIdx).getCandidates().add(
                        VoteResp.CandidateInfo
                            .builder()
                            .candidate(new CandidateResp(v.getCandidate()))
                            .voteCount(v.getVoteCount())
                            .build()
                    );

                }
            }
        }
        return formattedList;
    }
}
