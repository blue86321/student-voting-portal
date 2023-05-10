from typing import Callable

from django.utils import timezone
from rest_framework.response import Response

from rest_framework.test import APITestCase

from elections.models import Election, Position, Candidate
from elections.serializers import ElectionSerializer
from users.models import User, University


class DiffUserRes:
    def __init__(self, no_login: Response, normal_user: Response, admin: Response):
        self.no_login = no_login
        self.normal_user = normal_user
        self.admin = admin


class ElectionTestCase(APITestCase):
    def setUp(self):
        new_election = {
            "election_name": "SCU student council election",
            "desc": "desc for SCU student council election",
            "start_time": timezone.now(),
            "end_time": timezone.now(),
        }
        self.new_election = Election.objects.create(**new_election)

        new_position = {
            "election_id": self.new_election.id,
            "position_name": "SCU student council president",
            "desc": "desc for SCU student council president",
            "max_votes_total": 1,
            "max_votes_per_candidate": 1,
        }
        self.new_position = Position.objects.create(**new_position)

        new_university = {"name": "Santa Clara University"}
        self.new_university = University.objects.create(**new_university)

        self.new_user_pwd = "test_password"
        new_user = {
            "email": "test_email@scu.edu",
            "password": self.new_user_pwd,
            "password_confirm": self.new_user_pwd,
            "university_id": self.new_university.id,
            "dob": "1990-01-01",
        }
        new_user_json = self.client.post("/users/", data=new_user).json()
        self.new_user = User.objects.get(id=new_user_json.get("id"))

        new_candidate = {
            "user_id": self.new_user.id,
            "election_id": self.new_election.id,
            "position_id": self.new_position.id,
            "candidate_name": "John Miller",
            "desc": "desc for candidates",
        }
        self.new_candidate = Candidate.objects.create(**new_candidate)

        self.new_admin_pwd = "test_admin"
        new_admin = {
            "email": "test_admin@scu.edu",
            "password": self.new_admin_pwd,
            "password_confirm": self.new_admin_pwd,
            "university_id": self.new_university.id,
            "dob": "1980-01-01",
        }
        new_admin_json = self.client.post("/users/", data=new_admin).json()
        self.new_admin = User.objects.get(id=new_admin_json.get("id"))
        self.new_admin.is_staff = True
        self.new_admin.is_superuser = True
        self.new_admin.save()

    def test_api_get_elections(self):
        existing_election = ElectionSerializer(instance=self.new_election).data
        get_response = self.client.get(f"/elections/{self.new_election.id}/")
        get_json = get_response.json()
        self.assertDictEqual(get_json, existing_election)

    def test_api_post_elections(self):
        election_count = Election.objects.count()
        existing_election = ElectionSerializer(instance=self.new_election).data
        res = self.diff_user_call(self.client.post, "/elections/", data=existing_election)
        # no login
        self.assertTrue(res.no_login.exception)
        # normal user
        self.assertTrue(res.normal_user.exception)
        # admin
        self.assertFalse(res.admin.exception)
        self.assertEqual(election_count + 1, Election.objects.count())

    def test_api_put_elections(self):
        existing_election = ElectionSerializer(instance=self.new_election).data
        modified_election = existing_election
        modified_election["desc"] = "NEW_DESC"
        res = self.diff_user_call(self.client.put, f"/elections/{self.new_election.id}/", data=modified_election)
        # no login
        self.assertTrue(res.no_login.exception)
        # normal user
        self.assertTrue(res.normal_user.exception)
        # admin
        self.assertFalse(res.admin.exception)
        put_json = res.admin.json()
        self.assertDictEqual(put_json, modified_election)
        self.client.logout()

    def test_api_patch_elections(self):
        existing_election = ElectionSerializer(instance=self.new_election).data
        modified_election = existing_election
        patch_data = {"desc": "ANOTHER_DESC"}
        modified_election.update(patch_data)
        res = self.diff_user_call(self.client.patch, f"/elections/{self.new_election.id}/", data=patch_data)
        # no login
        self.assertTrue(res.no_login.exception)
        # normal user
        self.assertTrue(res.normal_user.exception)
        # admin
        self.assertFalse(res.admin.exception)
        patch_json = res.admin.json()
        self.assertDictEqual(patch_json, modified_election)

    def test_api_delete_elections(self):
        res = self.diff_user_call(self.client.delete, f"/elections/{self.new_election.id}/")
        # no login
        self.assertTrue(res.no_login.exception)
        # normal user
        self.assertTrue(res.normal_user.exception)
        # admin
        self.assertFalse(res.admin.exception)
        deleted_election = Election.objects.get(id=self.new_election.id)
        self.assertTrue(deleted_election.delete_time)

    def diff_user_call(self, callback: Callable, *args, **kwargs):
        """Call `callback` function based on different users, including `no login`, `normal user`, `admin`"""
        # no login
        no_login_res = callback(*args, **kwargs)
        # normal user
        self.client.login(email=self.new_user.email, password=self.new_user_pwd)
        normal_user_res = callback(*args, **kwargs)
        self.client.logout()
        # admin
        self.client.login(email=self.new_admin.email, password=self.new_admin_pwd)
        admin_res = callback(*args, **kwargs)
        self.client.logout()
        return DiffUserRes(no_login_res, normal_user_res, admin_res)

    # TODO: test cases for positions/candidates/vote
