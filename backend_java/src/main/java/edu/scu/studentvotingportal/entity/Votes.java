package edu.scu.studentvotingportal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@EqualsAndHashCode(callSuper = false)
@Data
@NoArgsConstructor
@Entity
public class Votes extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "elections_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Elections election;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "positions_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Positions position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidates_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    Candidates candidate;

    @Column(nullable = false)
    Integer voteCount;


    private Votes(Builder builder) {
        this.user = builder.users;
        this.election = builder.elections;
        this.position = builder.positions;
        this.candidate = builder.candidates;
        this.voteCount = builder.voteCount;
    }

    public static class Builder {
        Users users;
        Elections elections;
        Positions positions;
        Candidates candidates;
        Integer voteCount;

        public Builder user(Users user) {
            this.users = user;
            return this;
        }

        public Builder election(Elections election) {
            this.elections = election;
            return this;
        }

        public Builder position(Positions position) {
            this.positions = position;
            return this;
        }

        public Builder candidate(Candidates candidate) {
            this.candidates = candidate;
            return this;
        }

        public Builder voteCount(Integer voteCount) {
            this.voteCount = voteCount;
            return this;
        }

        public Votes build() {
            return new Votes(this);
        }
    }
}
