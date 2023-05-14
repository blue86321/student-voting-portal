from django.db.models import QuerySet
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.viewsets import ModelViewSet

from elections.models import Election, Position, Vote, Candidate
from elections.serializers import ElectionSerializer, PositionSerializer, CandidateSerializer, VoteSerializer
from student_voting_portal.utils.permissions import IsOwnerOrAdmin, VotePermission, Get, IsSameUniversity


class ElectionView(ModelViewSet):
    serializer_class = ElectionSerializer
    queryset = Election.objects.all()
    permission_classes = [Get | (IsAdminUser & IsSameUniversity)]


class PositionView(ModelViewSet):
    serializer_class = PositionSerializer
    queryset = Position.objects.all()
    permission_classes = [Get | (IsAdminUser & IsSameUniversity)]


class CandidateView(ModelViewSet):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()
    permission_classes = [Get | (IsOwnerOrAdmin & IsSameUniversity)]


class VoteView(CreateAPIView, ListAPIView):
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()
    permission_classes = [VotePermission]

    def create(self, request: Request, *args, **kwargs):
        request.data["user_id"] = request.user.id
        return super().create(request, args, kwargs)

    def get_queryset(self):
        """user can only see his votes"""
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            queryset = queryset.filter(user_id=self.request.user.id)
        return queryset
