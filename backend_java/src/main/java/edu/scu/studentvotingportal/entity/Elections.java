package edu.scu.studentvotingportal.entity;

import edu.scu.studentvotingportal.dto.ElectionParams;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@EqualsAndHashCode(callSuper = false)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Elections extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    University university;

    @Column(nullable = false)
    String electionName;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    String electionDesc = "";

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date startTime;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date endTime;


    public Elections(ElectionParams params, University university) {
        this.university = university;
        this.electionName = params.getElectionName();
        this.electionDesc = params.getElectionDesc();
        this.startTime = params.getStartTime();
        this.endTime = params.getEndTime();
    }
}
