from django import views
from django.db import models
from rest_framework import permissions
from rest_framework.request import Request

from elections.models import Candidate, Position, Election
from users.models import User


class Get(permissions.BasePermission):
    def has_permission(self, request: Request, view: views.View):
        if request.method == "GET":
            return True
        return False


class GetOrAdmin(permissions.IsAdminUser):
    def has_permission(self, request: Request, view: views.View):
        """Everyone can GET, only admin can do other methods"""
        if request.method == "GET":
            return True
        return super().has_permission(request, view)


class NormalUserPost(permissions.BasePermission):
    def has_permission(self, request: Request, view):
        """Only normal user can post"""
        if request.method == "POST":
            return bool(request.user and not request.user.is_staff)
        return False


class PostOrAdmin(permissions.IsAdminUser):
    def has_permission(self, request: Request, view: views.View):
        """Everyone can POST, only admin can do other methods"""
        if request.method == "POST":
            return True
        return super().has_permission(request, view)


class IsPkOrAdmin(permissions.IsAuthenticated):
    def has_permission(self, request: Request, view: views.View):
        """IsAuthenticated"""
        return super().has_permission(request, view)

    def has_object_permission(self, request: Request, view: views.View, obj: models.Model):
        """IsPk or Admin"""
        return request.user.pk == obj.pk or request.user.is_staff


class IsOwnerOrAdmin(permissions.IsAuthenticated):
    def has_permission(self, request: Request, view: views.View):
        """IsAuthenticated"""
        return super().has_permission(request, view)

    def has_object_permission(self, request: Request, view: views.View, obj: models.Model):
        """IsOwner or Admin"""
        return request.user.pk == obj.user_id or request.user.is_staff


class IsSameUniversity(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: views.View, obj: models.Model):
        if isinstance(obj, Candidate):
            return User.objects.get(id=obj.user_id).university_id == request.user.university_id
        if isinstance(obj, Position):
            return Election.objects.get(id=obj.election_id).university_id == request.user.university_id
        return obj.university_id == request.user.university_id
