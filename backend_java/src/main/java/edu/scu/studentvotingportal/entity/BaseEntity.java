package edu.scu.studentvotingportal.entity;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;


@MappedSuperclass
public abstract class BaseEntity {
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date createTime;
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date updateTime;
}
