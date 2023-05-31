package edu.scu.studentvotingportal.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.scu.studentvotingportal.dto.CandidateParams;
import edu.scu.studentvotingportal.dto.CandidateResp;
import edu.scu.studentvotingportal.entity.Candidates;
import edu.scu.studentvotingportal.entity.Elections;
import edu.scu.studentvotingportal.entity.Positions;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.exception.ValidationException;
import edu.scu.studentvotingportal.repository.CandidateRepository;
import edu.scu.studentvotingportal.repository.ElectionRepository;
import edu.scu.studentvotingportal.repository.PositionRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.CandidateService;
import edu.scu.studentvotingportal.utils.Permissions;

@Service
public class CandidateServiceImpl implements CandidateService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ElectionRepository electionRepository;
    @Autowired
    PositionRepository positionRepository;
    @Autowired
    CandidateRepository candidateRepository;

    @Override
    public CandidateResp getCandidateInfoById(Long candidateId) {
        Candidates candidates = candidateRepository
            .findById(candidateId)
            .orElseThrow(() -> new DataNotExistsException("Candidate not found"));
        return new CandidateResp(candidates);
    }

    @Override
    public List<CandidateResp> getAllCandidateInfo() {
        List<Candidates> candidates = candidateRepository.findAll();
        List<CandidateResp> retCandidates = new ArrayList<>();
        for (Candidates candidate : candidates) {
            retCandidates.add(new CandidateResp(candidate));
        }
        return retCandidates;
    }

    @Override
    public CandidateResp createCandidate(CandidateParams candidateParams, Users sourceUser) {
        if (candidateParams.getElectionId() == null) {
            throw new ValidationException("Parameters are not complete");
        }
        Elections election = electionRepository
            .findById(candidateParams.getElectionId())
            .orElseThrow(() -> new DataNotExistsException("Elections not found"));

        // validate
        validate(candidateParams, sourceUser, election.getUniversity().getId(), false);

        Positions position = positionRepository
            .findById(candidateParams.getPositionId())
            .orElseThrow(() -> new DataNotExistsException("Position not found"));
        Candidates candidates = new Candidates(candidateParams, election, position);
        Candidates savedCandidates = candidateRepository.save(candidates);
        return new CandidateResp(savedCandidates);
    }

    @Override
    public CandidateResp modifyCandidate(Long sourceUserId, Long candidateId, CandidateParams candidateParams,
                                         boolean partial) {
        Candidates candidates = candidateRepository
            .findById(candidateId)
            .orElseThrow(() -> new DataNotExistsException("Candidate not found"));
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));

        // validate
        validate(candidateParams, sourceUser, candidates.getElection().getUniversity().getId(), partial);

        // update
        if (candidateParams.getElectionId() != null) {
            candidates.setElection(electionRepository
                .findById(candidateParams.getElectionId())
                .orElseThrow(() -> new DataNotExistsException("Election not found")));
        }
        if (candidateParams.getPositionId() != null) {
            candidates.setPosition(positionRepository
                .findById(candidateParams.getPositionId())
                .orElseThrow(() -> new DataNotExistsException("Position not found")));
        }
        if (candidateParams.getCandidateName() != null) {
            candidates.setCandidateName(candidateParams.getCandidateName());
        }
        if (candidateParams.getCandidateDesc() != null) {
            candidates.setCandidateDesc(candidateParams.getCandidateDesc());
        }
        if (candidateParams.getPhotoUrl() != null) {
            candidates.setPhotoUrl(candidateParams.getPhotoUrl());
        }
        return new CandidateResp(candidateRepository.save(candidates));
    }

    private void validate(CandidateParams candidateParams, Users sourceUser, Long electionUniversityId,
                          boolean partial) {
        if (
            !partial && (
                candidateParams.getElectionId() == null ||
                    candidateParams.getPositionId() == null ||
                    candidateParams.getCandidateName() == null
            )
        ) {
            throw new ValidationException("Parameters are not complete");
        }
        Permissions.admin(sourceUser);
        Permissions.sameUniversityOrSuperuser(sourceUser, electionUniversityId);
    }

    @Override
    public void deleteCandidate(Long userId, Long candidateId) {
        Candidates candidates = candidateRepository
            .findById(candidateId)
            .orElseThrow(() -> new DataNotExistsException("Candidate not found"));
        Users sourceUser = userRepository
            .findById(userId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Permissions.admin(sourceUser);
        Permissions.sameUniversityOrSuperuser(sourceUser, candidates.getElection().getUniversity().getId());
        candidateRepository.delete(candidates);
    }
}
