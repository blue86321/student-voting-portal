from datetime import timedelta
from typing import Callable

from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.test import APITestCase, APIRequestFactory

from elections.models import Election, Position, Candidate, Vote
from elections.serializers import ElectionSerializer, PositionSerializer, CandidateSerializer
from users.models import University
from users.serializers import UserSerializer

context = {
    "request": Request(APIRequestFactory().get("/")),
}


class DiffUserRes:
    def __init__(self, no_login: Response, normal_user: Response, admin: Response):
        self.no_login = no_login
        self.normal_user = normal_user
        self.admin = admin


class AbstractTestCase(APITestCase):
    another_position = None
    another_election = None
    another_user = None
    another_university = None
    new_admin_pwd = "test_admin"
    new_admin = None
    new_user = None
    new_user_pwd = "test_password"
    new_position = None
    new_university = None
    new_election = None

    @classmethod
    def setUpTestData(cls):
        new_university_data = {"name": "Santa Clara University"}
        cls.new_university = University.objects.create(**new_university_data)
        another_university_data = {"name": "San Jose State University"}
        cls.another_university = University.objects.create(**another_university_data)

        new_election_data = {
            "university_id": cls.new_university.id,
            "election_name": "SCU student council election",
            "election_desc": "desc for SCU student council election",
            "start_time": timezone.now(),
            "end_time": timezone.now() + timedelta(days=1),
        }
        cls.new_election = Election.objects.create(**new_election_data)
        another_election_data = {
            "university_id": cls.another_university.id,
            "election_name": "SJSU student council election",
            "election_desc": "desc for SJSU student council election",
            "start_time": timezone.now(),
            "end_time": timezone.now() + timedelta(days=1),
        }
        cls.another_election = Election.objects.create(**another_election_data)

        new_position_data = {
            "election_id": cls.new_election.id,
            "position_name": "SCU student council president",
            "position_desc": "desc for SCU student council president",
            "max_votes_total": 2,
            "max_votes_per_candidate": 2,
        }
        cls.new_position = Position.objects.create(**new_position_data)
        another_position_data = {
            "election_id": cls.another_election.id,
            "position_name": "SJSU student council president",
            "position_desc": "desc for SJSU student council president",
            "max_votes_total": 1,
            "max_votes_per_candidate": 1,
        }
        cls.another_position = Position.objects.create(**another_position_data)

        new_user_data = {
            "email": "test_email@scu.edu",
            "password": cls.new_user_pwd,
            "password_confirm": cls.new_user_pwd,
            "university_id": cls.new_university.id,
            "dob": "1990-01-01",
        }
        serializer = UserSerializer(data=new_user_data)
        serializer.is_valid(raise_exception=True)
        cls.new_user = serializer.save()

        new_user_data["email"] = "user2@scu.edu"
        serializer = UserSerializer(data=new_user_data)
        serializer.is_valid(raise_exception=True)
        cls.new_user2 = serializer.save()

        another_user_data = {
            "email": "another_email@sjsu.edu",
            "password": cls.new_user_pwd,
            "password_confirm": cls.new_user_pwd,
            "university_id": cls.another_university.id,
            "dob": "2000-01-01",
        }
        serializer = UserSerializer(data=another_user_data)
        serializer.is_valid(raise_exception=True)
        cls.another_user = serializer.save()

        new_candidate_data = {
            "user_id": cls.new_user.id,
            "election_id": cls.new_election.id,
            "position_id": cls.new_position.id,
            "candidate_name": "John Miller",
            "candidate_desc": "desc for candidates",
        }
        cls.new_candidate = Candidate.objects.create(**new_candidate_data)
        another_candidate_data = {
            "user_id": cls.another_user.id,
            "election_id": cls.another_election.id,
            "position_id": cls.another_position.id,
            "candidate_name": "John Miller",
            "candidate_desc": "desc for candidates",
        }
        cls.another_candidate = Candidate.objects.create(**another_candidate_data)

        new_admin_data = {
            "email": "test_admin@scu.edu",
            "password": cls.new_admin_pwd,
            "password_confirm": cls.new_admin_pwd,
            "university_id": cls.new_university.id,
            "dob": "1980-01-01",
            "is_staff": 1,
        }
        serializer = UserSerializer(data=new_admin_data)
        serializer.is_valid()
        cls.new_admin = serializer.save()

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


class ElectionTestCase(AbstractTestCase):
    def test_api_elections_get(self):
        existing_election = ElectionSerializer(instance=self.new_election, context=context).data
        get_response = self.client.get(f"/elections/{self.new_election.id}/")
        get_json = get_response.json().get("data")
        self.assertDictEqual(get_json, existing_election)

    def test_api_elections_post(self):
        election_count = Election.objects.count()
        existing_election = ElectionSerializer(instance=self.new_election, context=context).data
        res = self.diff_user_call(
            self.client.post, "/elections/",
            data={
                **existing_election,
                "university_id": existing_election.get("university").get("id")
            }
        )
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        self.assertFalse(res.admin.exception)
        self.assertEqual(election_count + 1, Election.objects.count())
        return res.admin.json().get("data")

    def test_api_elections_put(self):
        modified_election = ElectionSerializer(instance=self.new_election, context=context).data
        modified_election["election_desc"] = "NEW_DESC"
        res = self.diff_user_call(
            self.client.put, f"/elections/{self.new_election.id}/",
            data={
                **modified_election,
                "university_id": modified_election.get("university").get("id")
            }
        )
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        self.assertFalse(res.admin.exception)
        put_json = res.admin.json().get("data")
        self.assertDictEqual(put_json, modified_election)

        # another university
        modified_election = ElectionSerializer(instance=self.another_election, context=context).data
        modified_election["election_desc"] = "NEW_DESC"
        res = self.diff_user_call(
            self.client.put, f"/elections/{self.another_election.id}/",
            data={
                **modified_election,
                "university_id": modified_election.get("university").get("id")
            }
        )
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.admin.status_code, status.HTTP_403_FORBIDDEN)

    def test_api_elections_patch(self):
        existing_election = ElectionSerializer(instance=self.new_election, context=context).data
        modified_election = existing_election
        patch_data = {"election_desc": "ANOTHER_DESC"}
        modified_election.update(patch_data)
        res = self.diff_user_call(self.client.patch, f"/elections/{self.new_election.id}/", data=patch_data)
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        self.assertFalse(res.admin.exception)
        patch_json = res.admin.json().get("data")
        self.assertDictEqual(patch_json, modified_election)

    def test_api_elections_delete(self):
        new_election_data = self.test_api_elections_post()
        res = self.diff_user_call(self.client.delete, f"/elections/{new_election_data['id']}/")
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        self.assertFalse(res.admin.exception)
        with self.assertRaises(ObjectDoesNotExist):
            Election.objects.get(id=new_election_data['id'])


class PositionTestCase(AbstractTestCase):
    def test_api_positions_post(self):
        position_count = Position.objects.count()
        existing_position = PositionSerializer(instance=self.new_position, context=context).data
        res = self.diff_user_call(self.client.post, "/positions/", data=existing_position)
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        res_json = {**res.admin.json().get("data")}
        remove_col = ["id", "url"]
        for col in remove_col:
            del res_json[col]
            del existing_position[col]
        self.assertDictEqual(res_json, existing_position)
        self.assertEqual(position_count + 1, Position.objects.count())
        return res.admin.json().get("data")

    def test_api_positions_get(self):
        # Detail
        get_res = self.client.get(f"/positions/{self.new_position.id}/")
        get_json = get_res.json().get("data")
        existing_position = PositionSerializer(instance=self.new_position, context=context).data
        self.assertDictEqual(get_json, existing_position)
        # List
        position_count = Position.objects.count()
        list_res = self.client.get("/positions/")
        self.assertEqual(len(list_res.json().get("data")), position_count)

    def test_api_positions_put(self):
        modified_position = PositionSerializer(instance=self.new_position, context=context).data
        modified_position["position_desc"] = "NEW_DESC"
        modified_position["max_votes_total"] = 2
        res = self.diff_user_call(self.client.put, f"/positions/{self.new_position.id}/", data=modified_position)
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        self.assertDictEqual(res.admin.json().get("data"), modified_position)

        # another university
        modified_position = PositionSerializer(instance=self.another_position, context=context).data
        modified_position["position_desc"] = "NEW_DESC"
        res = self.diff_user_call(self.client.put, f"/positions/{self.another_position.id}/", data=modified_position)
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.admin.status_code, status.HTTP_403_FORBIDDEN)

    def test_api_positions_patch(self):
        existing_position = PositionSerializer(instance=self.new_position, context=context).data
        modified_position = existing_position
        patch_data = {"position_desc": "ANOTHER_DESC"}
        modified_position.update(patch_data)
        res = self.diff_user_call(self.client.patch, f"/positions/{self.new_position.id}/", data=patch_data)
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        self.assertDictEqual(res.admin.json().get("data"), modified_position)

    def test_api_positions_delete(self):
        new_position_data = self.test_api_positions_post()
        res = self.diff_user_call(self.client.delete, f"/positions/{new_position_data['id']}/")
        self.assertEqual(res.no_login.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res.normal_user.status_code, status.HTTP_403_FORBIDDEN)
        # admin
        self.assertFalse(res.admin.exception)
        with self.assertRaises(ObjectDoesNotExist):
            Position.objects.get(id=new_position_data["id"])


class CandidateTestCase(AbstractTestCase):

    def test_api_candidates_post(self):
        candidate_count = Candidate.objects.count()
        existing_candidate = CandidateSerializer(instance=self.new_candidate, context=context).data
        new_candidate = existing_candidate
        new_candidate["user_id"] = self.another_user.id
        new_candidate["candidate_name"] = "Silvia"

        # no login
        self.assertTrue(self.client.post("/candidates/", data=new_candidate).exception)

        # normal user
        self.client.login(email=self.new_user.email, password=self.new_user_pwd)
        res = self.client.post("/candidates/", data=new_candidate)
        self.assertFalse(res.exception)
        # post again
        res_again = self.client.post("/candidates/", data=new_candidate)
        self.assertTrue(res_again.status_code, status.HTTP_400_BAD_REQUEST)
        Candidate.objects.get(id=res.json().get("data").get("id")).delete()
        # another university
        self.client.logout()

        # admin
        self.client.login(email=self.new_admin.email, password=self.new_admin_pwd)
        res = self.client.post("/candidates/", data=new_candidate)
        res_json = {**res.json().get("data")}
        remove_col = ["id", "url"]
        for col in remove_col:
            del res_json[col]
            del new_candidate[col]
        self.assertDictEqual(res_json, new_candidate)
        self.assertEqual(candidate_count + 1, Candidate.objects.count())
        self.client.logout()
        return res.json().get("data")

    def test_api_candidates_get(self):
        # Detail
        get_res = self.client.get(f"/candidates/{self.new_position.id}/")
        get_json = get_res.json().get("data")
        existing_candidate = CandidateSerializer(instance=self.new_candidate, context=context).data
        self.assertDictEqual(get_json, existing_candidate)
        # List
        candidate_count = Candidate.objects.count()
        list_res = self.client.get("/candidates/")
        list_json = list_res.json().get("data")
        self.assertEqual(len(list_json), candidate_count)

    def test_api_candidates_put(self):
        modified_candidate = CandidateSerializer(instance=self.new_candidate, context=context).data
        modified_candidate["candidate_desc"] = "NEW_DESC"
        another_candidate = self.test_api_candidates_post()
        another_candidate["candidate_desc"] = "NEW_DESC"

        # no login
        self.assertTrue(self.client.put(f"/candidates/{self.new_candidate.id}/", data=modified_candidate).exception)

        # normal user
        self.client.login(email=self.new_user.email, password=self.new_user_pwd)
        res_json = self.client.put(f"/candidates/{self.new_candidate.id}/", data=modified_candidate).json().get("data")
        self.assertDictEqual(res_json, modified_candidate)
        # normal user (put another candidate in the same university)
        res = self.client.put(f"/candidates/{another_candidate['id']}/", data=another_candidate)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()
        Candidate.objects.get(id=another_candidate.get("id")).delete()

        # admin
        modified_candidate["candidate_desc"] = "ADMIN_NEW_DESC"
        self.client.login(email=self.new_admin.email, password=self.new_admin_pwd)
        res_json = self.client.put(f"/candidates/{self.new_candidate.id}/", data=modified_candidate).json().get("data")
        self.assertDictEqual(res_json, modified_candidate)
        # another university
        modified_candidate = CandidateSerializer(instance=self.another_candidate, context=context).data
        modified_candidate["candidate_desc"] = "ADMIN_NEW_DESC"
        res = self.client.put(f"/candidates/{self.another_candidate.id}/", data=modified_candidate)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_api_candidates_delete(self):
        existing_candidate = CandidateSerializer(instance=self.new_candidate, context=context).data
        # no login
        res = self.client.delete(f"/candidates/{self.new_candidate.id}/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        # normal user
        self.client.login(email=self.new_user.email, password=self.new_user_pwd)
        self.assertFalse(self.client.delete(f"/candidates/{self.new_candidate.id}/").exception)
        # diff university
        res = self.client.delete(f"/candidates/{self.another_candidate.id}/")
        self.assertTrue(res.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()
        del existing_candidate["url"]
        new_candidate = Candidate.objects.create(**existing_candidate)

        # admin
        self.client.login(email=self.new_admin.email, password=self.new_admin_pwd)
        self.assertFalse(self.client.delete(f"/candidates/{new_candidate.id}/").exception)
        # diff university
        res = self.client.delete(f"/candidates/{self.another_candidate.id}/")
        self.assertTrue(res.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()


class VoteTestCase(AbstractTestCase):

    def test_api_vote_post(self):
        vote_count = 2
        vote_data = {
            "election_id": self.new_election.id,
            "votes": [
                {
                    "position_id": self.new_position.id,
                    "candidates": [
                        {
                            "candidate_id": self.new_candidate.id,
                            "vote_count": vote_count,
                        }
                    ]
                }
            ]
        }
        another_vote_data = {
            "election_id": self.another_election.id,
            "votes": [
                {
                    "position_id": self.another_position.id,
                    "candidates": [
                        {
                            "candidate_id": self.another_candidate.id,
                            "vote_count": 1,
                        }
                    ]
                }
            ]
        }

        # no login
        res = self.client.post("/votes/", data=vote_data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # normal user
        self.client.login(email=self.new_user.email, password=self.new_user_pwd)
        # expired election
        election = Election.objects.get(id=self.new_election.id)
        election.end_time = timezone.now()
        election.save()
        res = self.client.post("/votes/", data=vote_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # not yet started election
        election = Election.objects.get(id=self.new_election.id)
        election.start_time = timezone.now() + timedelta(days=2)
        election.end_time = timezone.now()
        election.save()
        res = self.client.post("/votes/", data=vote_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # normal vote
        candidate = Candidate.objects.get(id=self.new_candidate.id)
        election = Election.objects.get(id=self.new_election.id)
        election.start_time = timezone.now()
        election.end_time = timezone.now() + timedelta(days=2)
        election.save()
        res = self.client.post("/votes/", data=vote_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            candidate.vote_count + vote_count,
            res.json().get("data")["result"][0]["votes"][0]["candidates"][0]["vote_count"],
        )
        # post again
        res = self.client.post("/votes/", data=vote_data)
        self.assertTrue(res.exception)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # another university
        res = self.client.post("/votes/", data=another_vote_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.client.logout()

        # admin
        self.client.login(email=self.new_admin.email, password=self.new_admin_pwd)
        res = self.client.post("/votes/", data=vote_data)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()
        return vote_data

    def test_api_vote_get(self):
        self.test_api_vote_post()
        # no login
        self.assertEqual(self.client.get("/votes/").status_code, status.HTTP_401_UNAUTHORIZED)
        # normal user
        self.client.login(email=self.new_user.email, password=self.new_user_pwd)
        res = self.client.get("/votes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res = self.client.get(f"/votes/{self.new_election.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.client.logout()
        # admin
        self.client.login(email=self.new_admin.email, password=self.new_admin_pwd)
        res = self.client.get("/votes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.json().get("data")), 0)  # admin cannot vote
        self.client.logout()

    def test_api_vote_multiple_candidates(self):
        new_candidate_data = {
            "user_id": self.new_user2.id,
            "election_id": self.new_election.id,
            "position_id": self.new_position.id,
            "candidate_name": "Tim Cook",
            "candidate_desc": "desc for candidates",
        }
        candidate2 = Candidate.objects.create(**new_candidate_data)
        vote_data = {
            "election_id": self.new_election.id,
            "votes": [
                {
                    "position_id": self.new_position.id,
                    "candidates": [
                        {
                            "candidate_id": self.new_candidate.id,
                            "vote_count": 1,
                        },
                        {
                            "candidate_id": candidate2.id,
                            "vote_count": 1,
                        }
                    ]
                }
            ]
        }
        self.client.login(email=self.new_user2.email, password=self.new_user_pwd)
        res_post = self.client.post("/votes/", data=vote_data)
        self.assertEqual(res_post.status_code, status.HTTP_201_CREATED)
        res_get = self.client.get("/votes/", data=vote_data)
        self.assertEqual(res_get.status_code, status.HTTP_200_OK)
        self.client.logout()
