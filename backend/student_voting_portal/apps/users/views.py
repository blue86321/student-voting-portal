from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from student_voting_portal.apps.users.serializers import UserSerializer, UserDetailSerializer
from student_voting_portal.utils.BaseViewSet import BaseViewSet
from users.models import University


class UserView(BaseViewSet, CreateAPIView):
    """UserView for create a new user"""
    serializer_class = UserSerializer


class UserDetailView(BaseViewSet, RetrieveAPIView):
    serializer_class = UserDetailSerializer

    # only authenticated (login) user can access
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Override get_object() to improve efficiency """
        self.request.user.university = University.objects.get(pk=self.request.user.university_id).name
        return self.request.user
