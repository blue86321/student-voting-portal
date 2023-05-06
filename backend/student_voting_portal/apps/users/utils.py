from typing import Dict

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, str]) -> Dict[str, str]:
        """
        Add custom fields in the response of user login
        :param attrs: origin attrs (username, password)
        :return: enhanced attrs
        """
        data = super().validate(attrs)
        return {
            "id": self.user.pk,
            "username": self.user.get_username(),
            "university_id": self.user.university_id,
            "token": {
                "access": data.get("access"),
                "refresh": data.get("refresh"),
            }
        }
