from typing import Dict, Any

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.models import University
from users.serializers import UserSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, str]) -> dict[str, Any]:
        """
        Add custom fields in the response of user login
        :param attrs: origin attrs (username, password)
        :return: enhanced attrs
        """
        data = super().validate(attrs)
        serializer = UserSerializer(instance=self.user, context=self.context)
        return {
            **serializer.data,
            "token": {
                "access": data.get("access"),
                "refresh": data.get("refresh"),
            }
        }
