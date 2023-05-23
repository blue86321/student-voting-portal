package edu.scu.studentvotingportal.repository;

import edu.scu.studentvotingportal.entity.Positions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Positions, Long> {
    List<Positions> findAllByElectionId(Long electionId);
}
