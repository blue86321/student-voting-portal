from rest_framework import serializers, status

from users.models import User, University
from users.serializers import UserSerializer
from rest_framework.test import APITestCase


class UserTestCase(APITestCase):
    new_university = None
    new_user_pwd = "test_password"

    @classmethod
    def setUpTestData(cls):
        cls.new_university = University.objects.create(**{"name": "Santa Clara University"})
        cls.new_user_data = {
            "email": "test_email@scu.edu",
            "password": cls.new_user_pwd,
            "dob": "1995-01-01",
            "university_id": cls.new_university.id,
        }

    def test_user_serializer(self):
        # no `password_confirm`, should raise `ValidationError`
        with self.assertRaises(serializers.ValidationError) as pwd_error:
            serializer = UserSerializer(data=self.new_user_data)
            serializer.is_valid(raise_exception=True)
        self.assertIsNotNone(pwd_error.exception.detail.get("password_confirm"))

        # age < 18
        with self.assertRaises(serializers.ValidationError) as age_error:
            serializer = UserSerializer(data={
                **self.new_user_data,
                "password_confirm": self.new_user_data.get("password"),
                "dob": "2015-01-01",
            })
            serializer.is_valid(raise_exception=True)
        self.assertIsNotNone(age_error.exception.detail.get("dob"))

        # validation
        serializer = UserSerializer(data={**self.new_user_data, "password_confirm": self.new_user_data.get("password")})
        self.assertEqual(serializer.is_valid(), True)

        # save
        user_serializer = serializer.save()
        user_models = User.objects.get(email=self.new_user_data.get("email"))
        self.assertEqual(user_serializer, user_models)
        self.assertTrue(hasattr(user_serializer, "token"))

        user_models.delete()

    def test_api_post_user(self, delete=True):
        new_user_data = {
            **self.new_user_data,
            "password_confirm": self.new_user_pwd,
        }
        register_response = self.client.post("/users/", new_user_data)
        register_json = register_response.json()
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(email=self.new_user_data.get("email"))
        self.assertEqual(user.email, self.new_user_data.get("email"))
        self.assertEqual(user.email, register_json.get("email"))
        if delete:
            user.delete()
        return user, register_json

    def login_user(self, user):
        auth_data = {
            "email": user.email,
            "password": self.new_user_pwd,
        }
        login_response = self.client.post("/authentication/", auth_data)
        login_json = login_response.json()
        return login_json

    def test_api_login_user(self):
        user, register_json = self.test_api_post_user(delete=False)
        login_json = self.login_user(user)
        self.assertTrue(
            "token" in login_json and
            "refresh" in login_json.get("token")
            and "access" in login_json.get("token")
        )
        self.assertTrue("email" in login_json)
        user.delete()

    def test_jwt(self):
        def check_process(res_json):
            access_token = res_json.get("token").get("access")
            refresh_token = res_json.get("token").get("refresh")
            self.assertIsNotNone(access_token)
            self.assertIsNotNone(refresh_token)
            # Retrieve
            retrieve_res = self.client.get("/user/", headers={"Authorization": "Bearer " + access_token})
            retrieve_json = retrieve_res.json()
            self.assertEqual(retrieve_json.get("email"), user.email)
            # Refresh
            refresh_data = {"refresh": refresh_token}
            refresh_res = self.client.post("/authentication/refresh/", refresh_data)
            refresh_json = refresh_res.json()
            self.assertIsNotNone(refresh_json.get("access"))

        # Register
        user, register_json = self.test_api_post_user(delete=False)
        check_process(register_json)

        # Login
        login_json = self.login_user(user)
        check_process(login_json)

        # Response of register == login
        del register_json["token"]
        del login_json["token"]
        self.assertDictEqual(register_json, login_json)

        user.delete()
