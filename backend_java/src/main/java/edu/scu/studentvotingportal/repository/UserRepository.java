package edu.scu.studentvotingportal.repository;


import edu.scu.studentvotingportal.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findFirstByEmail(String email);
    List<Users> findAllByUniversityId(Long universityId);
}
