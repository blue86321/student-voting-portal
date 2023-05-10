from django.db import models

from student_voting_portal.utils.BaseModel import BaseModel
from users.models import User


class Election(BaseModel, models.Model):
    """Election meta data"""
    election_name = models.CharField(default="", max_length=255)
    desc = models.TextField(default="")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()


class Position(BaseModel, models.Model):
    """Position for elections, since an election can contain multiple positions"""
    election = models.ForeignKey(Election, on_delete=models.DO_NOTHING)
    position_name = models.CharField(default="", max_length=255)
    desc = models.TextField(default="")
    max_votes_total = models.IntegerField(default=1)
    max_votes_per_candidate = models.IntegerField(default=1)


class Candidate(BaseModel, models.Model):
    """Candidate of an election for a position"""
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    election = models.ForeignKey(Election, on_delete=models.DO_NOTHING)
    position = models.ForeignKey(Position, on_delete=models.DO_NOTHING)
    candidate_name = models.CharField(default="", max_length=255)
    desc = models.TextField(default="")


class Vote(BaseModel, models.Model):
    """users' vote for candidates in an election for a position"""
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    election_id = models.ForeignKey(Election, on_delete=models.DO_NOTHING)
    position_id = models.ForeignKey(Position, on_delete=models.DO_NOTHING)
    candidate_id = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    vote_count = models.IntegerField(default=1)
