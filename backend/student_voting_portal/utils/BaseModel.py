from django.db import models


class BaseModel(models.Model):
    """Common Fields for all models"""
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    delete_time = models.DateTimeField(null=True)

    class Meta:
        abstract = True
