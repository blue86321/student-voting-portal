from django.db.models import QuerySet
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from student_voting_portal.apps.users.serializers import UserSerializer, UserDetailSerializer, UniversitySerializer
from users.models import University, User
from student_voting_portal.utils.permissions import Post, IsOwnerOrAdmin, Get


class UserView(CreateAPIView, ReadOnlyModelViewSet):
    """Use case:
        1.to create a user
        2.for admin get a list of user
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [Post | IsAdminUser]

    def get_queryset(self):
        """Non-superuser can only see users in the same university"""
        queryset = self.queryset
        user = self.request.user
        if isinstance(queryset, QuerySet) and not user.is_superuser:
            queryset = queryset.filter(university_id=user.university_id)
        return queryset

    def get_permissions(self):
        if self.action == "list":
            self.permission_classes = [IsAdminUser]
        elif self.action == "retrieve":
            self.permission_classes = [IsOwnerOrAdmin]
        return super().get_permissions()


class UserOwnerView(RetrieveAPIView):
    """Use case: for user to access his own data"""
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Override get_object() to improve efficiency """
        self.request.user.university = University.objects.get(pk=self.request.user.university_id)
        return self.request.user


class UniversityView(ModelViewSet):
    serializer_class = UniversitySerializer
    queryset = University.objects.all()
    # In fact, only superuser can add/delete university,
    # here, for simplicity, allow admin to do it.
    permission_classes = [Get | IsAdminUser]
