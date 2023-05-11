from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.viewsets import ModelViewSet

from elections.models import Election, Position, Vote, Candidate
from elections.serializers import ElectionSerializer, PositionSerializer, CandidateSerializer, VoteSerializer
from student_voting_portal.utils.BaseViewSet import BaseViewSet
from student_voting_portal.utils.permissions import GetOrAdmin


class ElectionView(BaseViewSet, ModelViewSet):
    serializer_class = ElectionSerializer
    queryset = Election.objects.all()
    permission_classes = [GetOrAdmin]


class PositionView(BaseViewSet, ModelViewSet):
    serializer_class = PositionSerializer
    queryset = Position.objects.all()
    # TODO: only admin can create/update/delete (post/put/patch/delete)
    # permission_classes = []


class CandidateView(BaseViewSet, ModelViewSet):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()
    # TODO: only admin or owner user can create/update/delete (post/put/patch/delete)
    # permission_classes = []


class VoteView(BaseViewSet, CreateAPIView, RetrieveAPIView):
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()
    # TODO: only normal user can create (post)
    # TODO: everyone can retrieve (get)
    # permission_classes = []
