from __future__ import annotations

import datetime
from typing import Dict, Any
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User, University


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    # write_only: only for serializing (data -> instance)
    # read_only: only for de-serializing (instance -> data)
    remove_on_create_fields = ["password_confirm"]
    password_confirm = serializers.CharField(write_only=True)
    token = serializers.JSONField(read_only=True)
    university_id = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), source="university",
                                                       write_only=True)
    university = UniversitySerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "password", "password_confirm", "university_id", "university", "dob", "token",
                  "is_staff"]

        # edit column labels
        extra_kwargs = {
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

    def validate_dob(self, value: datetime.date):
        dob = value
        today = datetime.date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        if age < 18:
            raise serializers.ValidationError("age < 18")
        return value

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

        # set jwt token
        user.token = self.generate_jwt(user)
        return user

    @staticmethod
    def generate_jwt(user: UserSerializer.Meta.model) -> Dict[str, str]:
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class UserDetailSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "university", "dob", "is_staff"]
