from rest_framework import serializers, status

from users.models import User
from users.serializers import UserSerializer
from rest_framework.test import APITestCase


class UserTestCase(APITestCase):
    def setUp(self):
        self.new_user_data = {
            "username": "test_username",
            "password": "test_password",
            "university_id": 1,
        }

    def test_user_models(self):
        User.objects.create(**self.new_user_data)
        user = User.objects.get(username=self.new_user_data.get("username"))
        self.assertEqual(user.username, self.new_user_data.get("username"))

        user.delete()

    def test_user_serializer(self):
        # no `password_confirm`, should raise `ValidationError`
        with self.assertRaises(serializers.ValidationError):
            serializer = UserSerializer(data=self.new_user_data)
            serializer.is_valid(raise_exception=True)

        # validation
        serializer = UserSerializer(data={**self.new_user_data, "password_confirm": self.new_user_data.get("password")})
        self.assertEqual(serializer.is_valid(), True)

        # save
        user_serializer = serializer.save()
        user_models = User.objects.get(username=self.new_user_data.get("username"))
        self.assertEqual(user_serializer, user_models)
        self.assertTrue(hasattr(user_serializer, "token"))

        User.objects.get(username=self.new_user_data.get("username")).delete()

    def test_api_create_login_user(self):
        # Create user
        register_response = self.client.post('/users/',
                                    {**self.new_user_data, "password_confirm": self.new_user_data.get("password")},
                                    format='json')
        register_json = register_response.json()
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(username=self.new_user_data.get("username"))
        self.assertEqual(user.username, self.new_user_data.get("username"))
        self.assertEqual(user.username, register_json.get("username"))
        self.assertTrue(
            "token" in register_json and
            "access" in register_json.get("token") and
            "refresh" in register_json.get("token")
        )

        # Login user
        auth_data = {
            "username": self.new_user_data.get("username"),
            "password": self.new_user_data.get("password"),
        }
        login_response = self.client.post('/authentication/', auth_data, format='json')
        login_json = login_response.json()
        self.assertTrue(
            "token" in login_json and
            "refresh" in login_json.get("token")
            and "access" in login_json.get("token")
        )
        self.assertTrue("username" in login_json)

        # Refresh token
        refresh_data = {"refresh": login_json.get("token").get("refresh")}
        refresh_response = self.client.post('/authentication/refresh/', refresh_data, format='json')
        refresh_json = refresh_response.json()
        self.assertTrue("access" in refresh_json)

        # Response of register == login
        del register_json["token"]
        del login_json["token"]
        self.assertDictEqual(register_json, login_json)

        user.delete()
