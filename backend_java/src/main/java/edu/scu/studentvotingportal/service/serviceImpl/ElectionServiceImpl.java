package edu.scu.studentvotingportal.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.scu.studentvotingportal.dto.ElectionParams;
import edu.scu.studentvotingportal.dto.ElectionResp;
import edu.scu.studentvotingportal.dto.PositionResp;
import edu.scu.studentvotingportal.entity.Candidates;
import edu.scu.studentvotingportal.entity.Elections;
import edu.scu.studentvotingportal.entity.Positions;
import edu.scu.studentvotingportal.entity.University;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.exception.ValidationException;
import edu.scu.studentvotingportal.repository.CandidateRepository;
import edu.scu.studentvotingportal.repository.ElectionRepository;
import edu.scu.studentvotingportal.repository.PositionRepository;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.ElectionService;
import edu.scu.studentvotingportal.utils.Permissions;

@Service
public class ElectionServiceImpl implements ElectionService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ElectionRepository electionRepository;
    @Autowired
    UniversityRepository universityRepository;

    @Autowired
    PositionRepository positionRepository;

    @Autowired
    CandidateRepository candidateRepository;


    @Override
    public ElectionResp getElectionInfoById(Long electionId) {
        Elections election = electionRepository
            .findById(electionId)
            .orElseThrow(() -> new DataNotExistsException("Election not found"));
        return formatByElection(election);
    }

    @Override
    public List<ElectionResp> getAllElectionInfo() {
        List<Elections> elections = electionRepository.findAll();
        List<ElectionResp> retElections = new ArrayList<>();
        for (Elections election : elections) {
            retElections.add(formatByElection(election));
        }
        return retElections;
    }

    @Override
    public ElectionResp createElection(ElectionParams electionParams, Users sourceUser) {
        // validate
        validate(electionParams, sourceUser, electionParams.getUniversityId(), false);

        // create
        University university = universityRepository
            .findById(electionParams.getUniversityId())
            .orElseThrow(() -> new DataNotExistsException("University not found"));
        Elections elections = new Elections(electionParams, university);
        Elections savedElections = electionRepository.save(elections);
        return formatByElection(savedElections);
    }

    @Override
    public ElectionResp modifyElection(Long sourceUserId, Long electionId, ElectionParams electionParams,
                                       boolean partial) {
        Elections elections = electionRepository
            .findById(electionId)
            .orElseThrow(() -> new DataNotExistsException("Election not found"));
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));

        // validate
        validate(electionParams, sourceUser, elections.getUniversity().getId(), partial);

        // update
        if (electionParams.getUniversityId() != null) {
            elections.setUniversity(universityRepository
                .findById(electionParams.getUniversityId())
                .orElseThrow(() -> new DataNotExistsException("University not found")));
        }
        if (electionParams.getElectionName() != null) {
            elections.setElectionName(electionParams.getElectionName());
        }
        if (electionParams.getElectionDesc() != null) {
            elections.setElectionDesc(electionParams.getElectionDesc());
        }
        if (electionParams.getStartTime() != null) {
            elections.setStartTime(electionParams.getStartTime());
        }
        if (electionParams.getEndTime() != null) {
            elections.setEndTime(electionParams.getEndTime());
        }
        return formatByElection(electionRepository.save(elections));
    }

    private void validate(ElectionParams electionParams, Users sourceUser, Long electionUniversityId,
                          boolean partial) {
        if (
            !partial && (
                electionParams.getUniversityId() == null ||
                    electionParams.getElectionName() == null ||
                    electionParams.getElectionDesc() == null ||
                    electionParams.getStartTime() == null ||
                    electionParams.getEndTime() == null
            )
        ) {
            throw new ValidationException("Parameter is not complete");
        }
        if (electionParams.getStartTime() != null &&
            electionParams.getEndTime() != null &&
            electionParams.getStartTime().after(electionParams.getEndTime())) {
            throw new ValidationException("`startTime` > `endTime`");
        }
        Permissions.admin(sourceUser);
        Permissions.sameUniversityOrSuperuser(sourceUser, electionUniversityId);
    }

    @Override
    public void deleteElection(Long userId, Long electionId) {
        Elections elections = electionRepository
            .findById(electionId)
            .orElseThrow(() -> new DataNotExistsException("Election not found"));
        Users sourceUser = userRepository
            .findById(userId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Permissions.admin(sourceUser);
        Permissions.sameUniversityOrSuperuser(sourceUser, elections.getUniversity().getId());
        electionRepository.delete(elections);
    }

    private ElectionResp formatByElection(Elections election) {
        List<Positions> positions = positionRepository.findAllByElectionId(election.getId());
        List<PositionResp> positionRespList = new ArrayList<>();
        for (Positions p : positions) {
            List<Candidates> candidates = candidateRepository.findAllByPositionId(p.getId());
            positionRespList.add(new PositionResp(p, candidates));
        }
        return new ElectionResp(election, positionRespList);
    }
}
