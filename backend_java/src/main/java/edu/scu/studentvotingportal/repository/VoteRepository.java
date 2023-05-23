package edu.scu.studentvotingportal.repository;


import edu.scu.studentvotingportal.entity.Votes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Votes, Long> {
    List<Votes> findAllByUserId(Long userId);
    Optional<Votes> findFirstByUserIdAndElectionId(Long userId, Long electionId);
}
