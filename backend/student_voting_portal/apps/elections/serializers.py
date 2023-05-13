from typing import Dict, Any

from rest_framework import serializers

from elections.models import Election, Position, Vote, Candidate
from users.models import University, User


class PositionSerializer(serializers.ModelSerializer):
    election_id = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all(), source="election")

    class Meta:
        model = Position
        exclude = ["create_time", "update_time", "delete_time", "election"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
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
        if max_votes_total % max_votes_per_candidate != 0:
            raise serializers.ValidationError("`max_votes_total` must be divided by `max_votes_per_candidate`")
        return attrs


class CandidateSerializer(serializers.ModelSerializer):
    election_id = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all(), source="election")
    position_id = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all(), source="position")
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source="user")

    class Meta:
        model = Candidate
        exclude = ["create_time", "update_time", "delete_time", "election", "position", "user"]


class ElectionSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)
    candidates = CandidateSerializer(many=True, read_only=True)
    university_id = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), source="university",
                                                       write_only=True)
    university = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Election
        exclude = ["create_time", "update_time", "delete_time"]


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        exclude = ["create_time", "update_time", "delete_time"]
