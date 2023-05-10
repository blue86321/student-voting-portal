from django.db import models
from django.contrib.auth.models import AbstractUser

from student_voting_portal.utils.BaseModel import BaseModel


class User(BaseModel, AbstractUser):
    """Custom user model"""
    university_id = models.PositiveSmallIntegerField()


class University(BaseModel, models.Model):
    """University dimension table"""
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(max_length=64)
