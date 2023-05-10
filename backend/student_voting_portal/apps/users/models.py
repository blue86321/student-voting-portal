from django.db import models
from django.contrib.auth.models import AbstractUser

from student_voting_portal.utils.BaseModel import BaseModel
from django.utils.translation import gettext_lazy as _


class University(BaseModel, models.Model):
    """University dimension table"""
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(max_length=64)

    class Meta:
        db_table = "university"

    def __str__(self):
        return self.name


class User(BaseModel, AbstractUser):
    """Custom user model"""
    username = None
    email = models.EmailField(_('email address'), unique=True)
    university = models.ForeignKey(University, on_delete=models.DO_NOTHING)
    first_name = None
    last_name = None
    date_joined = None
    dob = models.DateField()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

