from rest_framework.generics import CreateAPIView

from student_voting_portal.apps.users.serializers import UserSerializer


class UserView(CreateAPIView):
    serializer_class = UserSerializer
