from typing import Dict, Any

from rest_framework import serializers

from elections.models import Election, Position, Vote


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        exclude = ["create_time", "update_time", "delete_time"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate attributes
        :param attrs: raw attributes
        :return: validated attributes
        """
        # validate max_votes
        max_votes_per_candidate = attrs.get("max_votes_per_candidate")
        max_votes_total = attrs.get("max_votes_total")
        if max_votes_total % max_votes_per_candidate != 0:
            raise serializers.ValidationError("`max_votes_total` must be divided by `max_votes_per_candidate`")
        return attrs


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        exclude = ["create_time", "update_time", "delete_time"]


class ElectionSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(read_only=True)
    candidates = CandidateSerializer(read_only=True)

    class Meta:
        model = Election
        exclude = ["create_time", "update_time", "delete_time"]


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        exclude = ["create_time", "update_time", "delete_time"]
