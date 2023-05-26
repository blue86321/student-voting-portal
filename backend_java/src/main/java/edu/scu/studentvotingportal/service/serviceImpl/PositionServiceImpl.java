package edu.scu.studentvotingportal.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.scu.studentvotingportal.dto.PositionParams;
import edu.scu.studentvotingportal.dto.PositionResp;
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
import edu.scu.studentvotingportal.service.PositionService;
import edu.scu.studentvotingportal.utils.Permissions;

@Service
public class PositionServiceImpl implements PositionService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    ElectionRepository electionRepository;
    @Autowired
    PositionRepository positionRepository;

    @Override
    public PositionResp getPositionInfoById(Long positionId) {
        Positions positions = positionRepository.findById(positionId).orElseThrow(() -> new DataNotExistsException(
            "Position not found"));
        List<Candidates> candidates = candidateRepository.findAllByPositionId(positions.getId());
        return new PositionResp(positions, candidates);
    }

    @Override
    public List<PositionResp> getAllPositionInfo() {
        List<Positions> positions = positionRepository.findAll();
        List<PositionResp> retPositions = new ArrayList<>();
        for (Positions p : positions) {
            List<Candidates> candidates = candidateRepository.findAllByPositionId(p.getId());
            retPositions.add(new PositionResp(p, candidates));
        }
        return retPositions;
    }

    @Override
    public PositionResp createPosition(PositionParams positionParams, Users sourceUser) {
        if (positionParams.getElectionId() == null) {
            throw new ValidationException("Parameters are not complete");
        }
        Elections elections = electionRepository
            .findById(positionParams.getElectionId())
            .orElseThrow(() -> new DataNotExistsException("Elections not found"));

        // validate
        validate(positionParams, sourceUser, elections.getUniversity().getId(), false);

        // create
        Positions positions = new Positions(positionParams, elections);
        Positions savedPositions = positionRepository.save(positions);
        return new PositionResp(savedPositions, new ArrayList<>());
    }

    @Override
    public PositionResp modifyPosition(Long sourceUserId, Long positionId, PositionParams positionParams,
                                       boolean partial) {
        Positions positions = positionRepository
            .findById(positionId)
            .orElseThrow(() -> new DataNotExistsException("Position not found"));
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));

        // validate
        validate(positionParams, sourceUser, positions.getElection().getUniversity().getId(), partial);

        // update
        if (positionParams.getElectionId() != null) {
            positions.setElection(electionRepository
                .findById(positionParams.getElectionId())
                .orElseThrow(() -> new DataNotExistsException("Election not found")));
        }
        if (positionParams.getPositionName() != null) {
            positions.setPositionName(positionParams.getPositionName());
        }
        if (positionParams.getPositionDesc() != null) {
            positions.setPositionDesc(positionParams.getPositionDesc());
        }
        if (positionParams.getMaxVotesTotal() != null) {
            positions.setMaxVotesTotal(positionParams.getMaxVotesTotal());
        }
        if (positionParams.getMaxVotesPerCandidate() != null) {
            positions.setMaxVotesPerCandidate(positionParams.getMaxVotesPerCandidate());
        }
        Positions savedPosition = positionRepository.save(positions);
        List<Candidates> candidates = candidateRepository.findAllByPositionId(savedPosition.getId());

        return new PositionResp(savedPosition, candidates);
    }

    private void validate(PositionParams positionParams, Users sourceUser, Long electionUniversityId,
                          boolean partial) {
        if (!partial && (
            positionParams.getElectionId() == null ||
                positionParams.getPositionName() == null ||
                positionParams.getMaxVotesTotal() == null ||
                positionParams.getMaxVotesPerCandidate() == null
        )
        ) {
            throw new ValidationException("Parameters are not complete");
        }
        if (positionParams.getMaxVotesTotal() != null &&
            positionParams.getMaxVotesPerCandidate() != null
        ) {
            int maxVotesTotal = positionParams.getMaxVotesTotal();
            int maxVotesPerCandidate = positionParams.getMaxVotesPerCandidate();
            if (maxVotesTotal < maxVotesPerCandidate)
                throw new ValidationException("`maxVotesTotal` < `maxVotesPerCandidate`");
            if (maxVotesTotal <= 0 || maxVotesPerCandidate <= 0) {
                throw new ValidationException("`maxVotesTotal` and `maxVotesPerCandidate` cannot be  > 0");
            }
        }
        Permissions.admin(sourceUser);
        Permissions.sameUniversityOrSuperuser(sourceUser, electionUniversityId);
    }

    @Override
    public void deletePosition(Long userId, Long positionId) {
        Positions positions = positionRepository
            .findById(positionId)
            .orElseThrow(() -> new DataNotExistsException("Position not found"));
        Users sourceUser = userRepository
            .findById(userId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Permissions.admin(sourceUser);
        Permissions.sameUniversityOrSuperuser(sourceUser, positions.getElection().getUniversity().getId());
        positionRepository.delete(positions);
    }
}
