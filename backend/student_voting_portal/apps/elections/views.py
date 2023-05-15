from django.db import transaction
from django.db.models import QuerySet
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet

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


class VoteView(CreateAPIView, ListAPIView, RetrieveAPIView, GenericViewSet):
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()
    permission_classes = [VotePermission]

    @transaction.atomic
    def create(self, request: Request, *args, **kwargs):
        if hasattr(request.data, "_mutable"):
            request.data._mutable = True
        request.data["user_id"] = request.user.id

        # check time between `start_time` and `end_time`
        election = Election.objects.get(id=request.data.get("election_id"))
        now = timezone.now()
        valid_time = election.start_time <= now <= election.end_time
        if not valid_time:
            return Response("election not yet starts or already ends", status=status.HTTP_400_BAD_REQUEST)

        # increment candidate `vote_count`
        candidate = Candidate.objects.get(id=request.data.get("candidate_id"))
        candidate.vote_count += 1
        candidate.save()

        # create `vote`
        return super().create(request, args, kwargs)

    def get_queryset(self):
        """user can only see his votes"""
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            queryset = queryset.filter(user_id=self.request.user.id)
        return queryset
