from django.utils import timezone

from rest_framework.test import APITestCase

from elections.models import Election, Position, Candidate
from elections.serializers import ElectionSerializer
from users.models import User, University


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
            "username": "test_username",
            "password": self.new_user_pwd,
            "password_confirm": self.new_user_pwd,
            "university_id": self.new_university.id,
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
            "username": "test_admin",
            "password": self.new_admin_pwd,
            "password_confirm": self.new_admin_pwd,
            "university_id": self.new_university.id,
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
        # no login
        self.assertTrue(self.client.post("/elections/", data=existing_election).exception)
        # normal user
        self.client.login(username=self.new_user.username, password=self.new_user_pwd)
        self.assertTrue(self.client.post("/elections/", data=existing_election).exception)
        self.client.logout()
        # admin
        self.client.login(username=self.new_admin.username, password=self.new_admin_pwd)
        self.client.post("/elections/", data=existing_election)
        self.assertEqual(election_count + 1, Election.objects.count())
        self.client.logout()

    def test_api_put_elections(self):
        existing_election = ElectionSerializer(instance=self.new_election).data
        modified_election = existing_election
        modified_election["desc"] = "NEW_DESC"
        # no login
        self.assertTrue(self.client.put(f"/elections/{self.new_election.id}/", data=modified_election).exception)
        # normal user
        self.client.login(username=self.new_user.username, password=self.new_user_pwd)
        self.assertTrue(self.client.put(f"/elections/{self.new_election.id}/", data=modified_election).exception)
        self.client.logout()
        # admin
        self.client.login(username=self.new_admin.username, password=self.new_admin_pwd)
        put_response = self.client.put(f"/elections/{self.new_election.id}/", data=modified_election)
        put_json = put_response.json()
        self.assertDictEqual(put_json, modified_election)
        self.client.logout()

    def test_api_patch_elections(self):
        existing_election = ElectionSerializer(instance=self.new_election).data
        modified_election = existing_election
        patch_data = {"desc": "ANOTHER_DESC"}
        modified_election.update(patch_data)
        # no login
        self.assertTrue(self.client.patch(f"/elections/{self.new_election.id}/", data=patch_data).exception)
        # normal user
        self.client.login(username=self.new_user.username, password=self.new_user_pwd)
        self.assertTrue(self.client.patch(f"/elections/{self.new_election.id}/", data=patch_data).exception)
        self.client.logout()
        # admin
        self.client.login(username=self.new_admin.username, password=self.new_admin_pwd)
        patch_response = self.client.patch(f"/elections/{self.new_election.id}/", data=patch_data)
        patch_json = patch_response.json()
        self.assertDictEqual(patch_json, modified_election)
        self.client.logout()

    def test_api_delete_elections(self):
        # no login
        self.assertTrue(self.client.delete(f"/elections/{self.new_election.id}/").exception)
        # normal user
        self.client.login(username=self.new_user.username, password=self.new_user_pwd)
        self.assertTrue(self.client.delete(f"/elections/{self.new_election.id}/").exception)
        self.client.logout()
        # admin
        self.client.login(username=self.new_admin.username, password=self.new_admin_pwd)
        self.client.delete(f"/elections/{self.new_election.id}/")
        deleted_election = Election.objects.get(id=self.new_election.id)
        self.assertTrue(deleted_election.delete_time)
        self.client.logout()

    # TODO: test cases for positions/candidates/vote
