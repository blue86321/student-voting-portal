from django.db import models

from student_voting_portal.utils.BaseModel import BaseModel
from users.models import User, University


class Election(BaseModel, models.Model):
    """Election meta data"""
    university = models.ForeignKey(University, on_delete=models.DO_NOTHING)
    election_name = models.CharField(default="", max_length=255)
    desc = models.TextField(default="")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()


class Position(BaseModel, models.Model):
    """Position for elections, since an election can contain multiple positions"""
    election = models.ForeignKey(Election, on_delete=models.DO_NOTHING, related_name="positions")
    position_name = models.CharField(default="", max_length=255)
    desc = models.TextField(default="")
    max_votes_total = models.IntegerField(default=1)
    max_votes_per_candidate = models.IntegerField(default=1)


class Candidate(BaseModel, models.Model):
    """Candidate of an election for a position"""
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    election = models.ForeignKey(Election, on_delete=models.DO_NOTHING, related_name="candidates")
    position = models.ForeignKey(Position, on_delete=models.DO_NOTHING)
    candidate_name = models.CharField(default="", max_length=255)
    desc = models.TextField(default="")
    photo_url = models.CharField(default="", max_length=255)


class Vote(BaseModel, models.Model):
    """users' vote for candidates in an election for a position"""
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    election = models.ForeignKey(Election, on_delete=models.DO_NOTHING)
    position = models.ForeignKey(Position, on_delete=models.DO_NOTHING)
    candidate = models.ForeignKey(Candidate, on_delete=models.DO_NOTHING)
    vote_count = models.IntegerField(default=1)

    class Meta:
        unique_together = [("user_id", "election", "position")]
