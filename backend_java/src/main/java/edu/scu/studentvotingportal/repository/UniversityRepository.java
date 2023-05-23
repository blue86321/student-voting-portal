package edu.scu.studentvotingportal.repository;


import edu.scu.studentvotingportal.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findFirstByName(String name);
}
