from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model"""
    university_id = models.PositiveSmallIntegerField()
