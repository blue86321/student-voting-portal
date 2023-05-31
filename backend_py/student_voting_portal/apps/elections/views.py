from typing import List, Dict, Any

from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
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
    permission_classes = [Get | (IsAdminUser & IsSameUniversity)]


class VoteCandidateView(APIView):
    """**Post** vote format:
    ```
    {
        "election_id": 1,
        "votes": [
            {
                "position_id": 1,
                "candidates": [
                    {"candidate_id": 1, "vote_count": 1},
                    {"candidate_id": 2, "vote_count": 1}
                ]
            }
        ]
    }
    ```
    """
    permission_classes = [VotePermission]

    @transaction.atomic
    def post(self, request: Request):
        if not request.data:
            return Response({"detail": "data cannot be empty"}, status.HTTP_400_BAD_REQUEST)
        data = request.data
        user_id = request.user.id
        election_id: int = data.get("election_id")
        votes: List[Dict[str, Any]] = data.get("votes")
        if not election_id or not votes:
            return Response({"detail": "invalid data"}, status.HTTP_400_BAD_REQUEST)

        vote_serializer_list: List[VoteSerializer] = []
        for vote_position in votes:
            # for each vote (one position + multiple candidates)
            position_id = vote_position.get("position_id")
            candidates = vote_position.get("candidates")
            if not position_id or not candidates:
                return Response({"detail": "invalid data"}, status.HTTP_400_BAD_REQUEST)

            position = Position.objects.get(id=position_id)
            serializer_list_for_position: List[VoteSerializer] = []
            for vote_candidate in candidates:
                # for each candidate
                candidate_id = vote_candidate.get("candidate_id")
                vote_count = vote_candidate.get("vote_count")
                if not candidate_id or not vote_count:
                    return Response({"detail": "invalid data"}, status.HTTP_400_BAD_REQUEST)

                vote_serializer = VoteSerializer(
                    data={
                        "user_id": user_id,
                        "election_id": election_id,
                        "position_id": position_id,
                        "candidate_id": candidate_id,
                        "vote_count": vote_count,
                    },
                    context={"request": self.request}
                )
                # internally check vote per candidate
                vote_serializer.is_valid(raise_exception=True)
                serializer_list_for_position.append(vote_serializer)

            # check total vote count
            total_vote_count = sum([s.validated_data.get("vote_count") for s in serializer_list_for_position])
            if position.max_votes_total < total_vote_count:
                return Response({"detail": f"max total vote exceeds for position {position.id}"},
                                status.HTTP_400_BAD_REQUEST)
            # add to total list
            vote_serializer_list.extend(serializer_list_for_position)

        vote_list: List[Vote] = []
        for serializer in vote_serializer_list:
            # increment candidate `vote_count`
            candidate = serializer.validated_data.get("candidate")
            candidate.vote_count += serializer.validated_data.get("vote_count")
            candidate.save()
            # save vote
            serializer.save()
            vote_list.append(serializer.instance)
        ret = self.serialize_vote_list(vote_list)
        return Response(ret, status.HTTP_201_CREATED)

    def get(self, request: Request, election_id: int = None):
        if election_id:
            queryset = Vote.objects.filter(user_id=self.request.user.id, election_id=election_id)
        else:
            queryset = Vote.objects.filter(user_id=self.request.user.id)

        if not queryset:
            return Response([], status.HTTP_200_OK)

        ret = self.serialize_vote_list(queryset)
        return Response(ret, status.HTTP_200_OK)

    def serialize_vote_list(self, vote_list: List[Vote]) -> Dict[str, List[Dict[str, Any]]]:
        election_idx_map = {}
        position_idx_map = {}
        formatted_list = []
        for vote in vote_list:
            if vote.election.id not in election_idx_map:
                election_idx_map[vote.election.id] = len(formatted_list)
                position_idx_map[vote.position.id] = 0
                formatted_list.append({
                    "election": {
                        "id": vote.election.id,
                        "election_name": vote.election.election_name,
                        "election_desc": vote.election.election_desc,
                        "start_time": vote.election.start_time,
                        "end_time": vote.election.end_time,
                    },
                    "votes": [{
                        "position": PositionSerializer(vote.position, context={"request": self.request}).data,
                        "candidates": [{
                            "candidate": CandidateSerializer(vote.candidate, context={"request": self.request}).data,
                            "vote_count": vote.vote_count,
                        }]
                    }],
                })
            else:
                election_idx = election_idx_map.get(vote.election.id)
                if vote.position.id not in position_idx_map:
                    position_idx_map[vote.position.id] = len(formatted_list[election_idx]["votes"])
                    formatted_list[election_idx]["votes"].append({
                        "position": PositionSerializer(vote.position, context={"request": self.request}).data,
                        "candidates": [{
                            "candidate": CandidateSerializer(vote.candidate, context={"request": self.request}).data,
                            "vote_count": vote.vote_count,
                        }]
                    })
                else:
                    position_idx = position_idx_map[vote.position.id]
                    formatted_list[election_idx]["votes"][position_idx]["candidates"].append({
                        "candidate": CandidateSerializer(vote.candidate, context={"request": self.request}).data,
                        "vote_count": vote.vote_count,
                    })
        return {"result": formatted_list}
