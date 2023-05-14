from django.db.models import QuerySet
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from student_voting_portal.apps.users.serializers import UserSerializer, UserDetailSerializer
from users.models import University, User
from student_voting_portal.utils.permissions import IsPkOrAdmin, PostOrAdmin


class UserView(CreateAPIView, ListAPIView):
    """Use case:
        1.to create a user
        2.for admin get a list of user
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [PostOrAdmin]

    def get_queryset(self):
        """Non-superuser can only see users in the same university"""
        queryset = self.queryset
        user = self.request.user
        if isinstance(queryset, QuerySet) and not user.is_superuser:
            queryset = queryset.filter(university_id=user.university_id)
        return queryset


class UserOwnerView(RetrieveAPIView):
    """Use case: for user to access his own data"""
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Override get_object() to improve efficiency """
        self.request.user.university = University.objects.get(pk=self.request.user.university_id)
        return self.request.user


class UserDetailView(RetrieveAPIView):
    """Use case: for admin to access a user detail"""
    serializer_class = UserDetailSerializer
    queryset = User.objects.all()
    permission_classes = [IsPkOrAdmin]
