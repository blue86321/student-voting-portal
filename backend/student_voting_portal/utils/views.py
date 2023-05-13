from django.db import models
from django.utils import timezone

from student_voting_portal.utils.exceptions import DeleteError


class BaseViewSet:
    def perform_destroy(self, instance: models.Model):
        """Soft delete if `delete_time` column exists, otherwise hard delete"""
        if hasattr(instance, "delete_time"):
            if not instance.delete_time:
                instance.delete_time = timezone.now()
                instance.save()
            else:
                raise DeleteError
        else:
            instance.delete()
