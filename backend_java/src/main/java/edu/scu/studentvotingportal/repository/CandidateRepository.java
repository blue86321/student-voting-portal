package edu.scu.studentvotingportal.repository;


import edu.scu.studentvotingportal.entity.Candidates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidates, Long> {
    List<Candidates> findAllByPositionId(Long positionId);
}
