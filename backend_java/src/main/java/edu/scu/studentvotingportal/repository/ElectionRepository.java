package edu.scu.studentvotingportal.repository;


import edu.scu.studentvotingportal.entity.Elections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElectionRepository extends JpaRepository<Elections, Long> {
}
