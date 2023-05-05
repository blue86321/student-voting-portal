from __future__ import annotations

from typing import Dict, Any
from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):
    # write_only: only for serializing (data -> instance)
    # read_only: only for de-serializing (instance -> data)
    remove_on_create_fields = ["password_confirm"]

    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "password_confirm", "university_id"]

        # edit column labels
        extra_kwargs = {
            "username": {
                "min_length": 6,
                "max_length": 32,
                "error_messages": {
                    "min_length": "username length need be to 6-32",
                    "max_length": "username length need be to 6-32",
                }
            },
            "password": {
                "write_only": True,
                "min_length": 8,
                "max_length": 32,
                "error_messages": {
                    "min_length": "password length need be to 8-32",
                    "max_length": "password length need be to 8-32",
                }
            },
        }

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate attributes
        :param attrs: raw attributes
        :return: validated attributes
        """
        # `password` and `password_confirm`
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError("passwords do not match")
        return attrs

    def create(self, validated_data: Dict[str, Any]) -> UserSerializer.Meta.model:
        """
        Override `create` method, because `password` need to be encrypted
        :param validated_data:
        :return:
        """
        # remove write only fields
        for field in self.remove_on_create_fields:
            del validated_data[field]

        # encrypt password
        user = self.Meta.model(**validated_data)
        user.set_password(validated_data.get("password"))

        # save to database
        user.save()
        return user
