from rest_framework import permissions
from rest_framework.request import Request


class ElectionPermission(permissions.IsAdminUser):
    def has_permission(self, request: Request, view):
        """Everyone can GET, only admin can do other methods"""
        if request.method == 'GET':
            return True
        return super().has_permission(request, view)
