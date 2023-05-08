from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model"""
    university_id = models.PositiveSmallIntegerField()


class University(models.Model):
    """University dimension table"""
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(max_length=64)
