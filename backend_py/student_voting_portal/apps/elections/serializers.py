from typing import Dict, Any, Union

from rest_framework import serializers
from django.utils import timezone

from elections.models import Election, Position, Vote, Candidate
from users.models import University, User
from users.serializers import UniversitySerializer


class CandidateSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all(), source="election")
    position_id = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all(), source="position")
    vote_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Candidate
        exclude = ["create_time", "update_time", "election", "position"]


class PositionSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all(), source="election")
    candidates = CandidateSerializer(many=True, read_only=True)
    total_vote_count = serializers.SerializerMethodField(read_only=True)

    def get_total_vote_count(self, obj: Position):
        return sum(c.vote_count for c in obj.candidates.all())

    class Meta:
        model = Position
        exclude = ["create_time", "update_time", "election"]

    def validate(self, attrs: Dict[str, Any]):
        """
        Validate attributes
        :param attrs: raw attributes
        :return: validated attributes
        """
        # validate max_votes
        max_votes_per_candidate = attrs.get("max_votes_per_candidate") or self.instance.max_votes_per_candidate
        max_votes_total = attrs.get("max_votes_total") or self.instance.max_votes_total
        if max_votes_total < max_votes_per_candidate:
            raise serializers.ValidationError("`max_votes_total` cannot be less than `max_votes_per_candidate`")
        return attrs


class ElectionSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    positions = PositionSerializer(many=True, read_only=True)
    university_id = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), source="university",
                                                       write_only=True)
    university = UniversitySerializer(read_only=True)

    class Meta:
        model = Election
        exclude = ["create_time", "update_time"]


class VoteSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all(), source="election",
                                                     write_only=True)
    position_id = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all(), source="position",
                                                     write_only=True)
    candidate_id = serializers.PrimaryKeyRelatedField(queryset=Candidate.objects.all(), source="candidate",
                                                      write_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source="user", write_only=True)

    election = ElectionSerializer(read_only=True)
    position = PositionSerializer(read_only=True)
    candidate = CandidateSerializer(read_only=True)

    def validate(self, attrs: Dict[str, Any]):
        # check time
        election: Union[Election, None] = attrs.get("election")
        valid_time = election.start_time <= timezone.now() <= election.end_time
        if not valid_time:
            raise serializers.ValidationError("election not yet starts or already ends")
        # check university
        user: Union[User, None] = attrs.get("user")
        if not user or not election or user.university_id != election.university.id:
            raise serializers.ValidationError("user can only vote for his/her university elections")
        # check vote_count
        vote_count: int = attrs.get("vote_count")
        position: Union[Position, None] = attrs.get("position")
        if position and position.max_votes_per_candidate < vote_count:
            raise serializers.ValidationError("vote count exceeds")
        # check position and candidate
        candidate: Union[Candidate, None] = attrs.get("candidate")
        if candidate and candidate.position_id != position.id:
            raise serializers.ValidationError("candidate and position are not matched")
        return attrs

    class Meta:
        model = Vote
        exclude = ["create_time", "update_time", "user"]
