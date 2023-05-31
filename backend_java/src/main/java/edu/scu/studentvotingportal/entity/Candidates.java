package edu.scu.studentvotingportal.entity;

import edu.scu.studentvotingportal.dto.CandidateParams;
import jakarta.persistence.*;
import lombok.*;


@EqualsAndHashCode(callSuper = false)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Candidates extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "elections_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Elections election;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "positions_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Positions position;

    @Column(nullable = false)
    String candidateName;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    String candidateDesc = "";

    @Builder.Default
    @Column(nullable = false)
    String photoUrl = "";

    @Builder.Default
    @Column(nullable = false)
    Integer voteCount = 0;

    public Candidates(CandidateParams params, Elections election, Positions position) {
        this.election = election;
        this.position = position;
        this.candidateName = params.getCandidateName();
        this.candidateDesc = params.getCandidateDesc();
        this.photoUrl = params.getPhotoUrl();
        this.voteCount = 0;
    }
}
