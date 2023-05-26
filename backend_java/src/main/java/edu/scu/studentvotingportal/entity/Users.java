package edu.scu.studentvotingportal.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.scu.studentvotingportal.dto.UserParams;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@EqualsAndHashCode(callSuper = false)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Users extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(unique = true, nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    University university;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    Date dob;

    boolean superuser;

    boolean staff;

    public Users(UserParams userParams, University university) {
        this.email = userParams.getEmail();
        this.password = userParams.getPassword();
        this.university = university;
        this.dob = userParams.getDob();
        this.staff = userParams.isAdmin();
    }
}
