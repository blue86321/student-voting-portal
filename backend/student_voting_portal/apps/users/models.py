from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

from student_voting_portal.utils.models import BaseModel
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """Custom user manager with no username field."""
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        uni = University.objects.create(name="Santa Clara University")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("university_id", uni.id)
        extra_fields.setdefault("dob", "2000-01-01")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra_fields)


class University(BaseModel, models.Model):
    """University dimension table"""
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(max_length=64)

    class Meta:
        db_table = "university"


class User(BaseModel, AbstractUser):
    """Custom user model"""
    objects = CustomUserManager()

    username = None
    email = models.EmailField(_("email address"), unique=True)
    university = models.ForeignKey(University, on_delete=models.DO_NOTHING)
    first_name = None
    last_name = None
    date_joined = None
    dob = models.DateField()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
