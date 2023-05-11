from django import views
from django.db import models
from rest_framework import permissions
from rest_framework.request import Request


class GetOrAdmin(permissions.IsAdminUser):
    def has_permission(self, request: Request, view):
        """Everyone can GET, only admin can do other methods"""
        if request.method == "GET":
            return True
        return super().has_permission(request, view)


class PostOrAdmin(permissions.IsAdminUser):
    def has_permission(self, request: Request, view: views.View):
        """Everyone can POST, only admin can do other methods"""
        if request.method == "POST":
            return True
        return super().has_permission(request, view)


class IsOwnerOrAdmin(permissions.IsAuthenticated):
    def has_permission(self, request: Request, view: views.View):
        """IsAuthenticated"""
        return super().has_permission(request, view)

    def has_object_permission(self, request: Request, view: views.View, obj: models.Model):
        """IsOwner or Admin"""
        return request.user.pk == obj.pk or request.user.is_staff
