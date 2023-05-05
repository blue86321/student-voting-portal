from rest_framework.generics import GenericAPIView, CreateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from student_voting_portal.apps.users.serializers import UserSerializer


class UserView(CreateAPIView):
    serializer_class = UserSerializer

    # def post(self, request: Request) -> Response:
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     # serializer.save()
    #     return Response(serializer.data)
