package edu.scu.studentvotingportal.entity;

import edu.scu.studentvotingportal.dto.PositionParams;
import jakarta.persistence.*;
import lombok.*;


@EqualsAndHashCode(callSuper = false)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Positions extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String positionName;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    String positionDesc = "";

    @Column(nullable = false)
    Integer maxVotesTotal;

    @Column(nullable = false)
    Integer maxVotesPerCandidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "elections_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Elections election;

    public Positions(PositionParams params, Elections elections) {
        this.positionName = params.getPositionName();
        this.positionDesc = params.getPositionDesc();
        this.maxVotesTotal = params.getMaxVotesTotal();
        this.maxVotesPerCandidate = params.getMaxVotesPerCandidate();
        this.election = elections;
    }
}
