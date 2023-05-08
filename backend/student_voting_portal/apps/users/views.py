from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from student_voting_portal.apps.users.serializers import UserSerializer, UserDetailSerializer
from users.models import User, University


class UserView(CreateAPIView):
    """UserView for create a new user"""
    serializer_class = UserSerializer


class UserDetailView(RetrieveAPIView):
    serializer_class = UserDetailSerializer

    # only authenticated (login) user can access
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Override get_object() to improve efficiency """
        self.request.user.university = University.objects.get(pk=self.request.user.university_id).name
        return self.request.user
