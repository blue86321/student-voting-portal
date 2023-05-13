from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ModelViewSet

from elections.models import Election, Position, Vote, Candidate
from elections.serializers import ElectionSerializer, PositionSerializer, CandidateSerializer, VoteSerializer
from student_voting_portal.utils.BaseViewSet import BaseViewSet
from student_voting_portal.utils.permissions import GetOrAdmin, IsOwnerOrAdmin, NormalUserPost


class ElectionView(BaseViewSet, ModelViewSet):
    serializer_class = ElectionSerializer
    queryset = Election.objects.all()
    permission_classes = [GetOrAdmin]


class PositionView(BaseViewSet, ModelViewSet):
    serializer_class = PositionSerializer
    queryset = Position.objects.all()
    permission_classes = [GetOrAdmin]


class CandidateView(BaseViewSet, ModelViewSet):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()
    permission_classes = [GetOrAdmin | IsOwnerOrAdmin]

    # def get_queryset(self):
    #     """Admin can only see users in the same university"""
    #     queryset = self.queryset
    #     if isinstance(queryset, QuerySet):
    #         Election.objects
    #         queryset = queryset.filter(university_id=self.request.user.university_id)
    #     return queryset


class VoteView(BaseViewSet, CreateAPIView):
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()
    permission_classes = [NormalUserPost]

