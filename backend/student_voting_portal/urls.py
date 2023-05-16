"""
URL configuration for student_voting_portal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from elections.views import ElectionView, PositionView, CandidateView, VoteCandidateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import UserView, UserOwnerView, UniversityView
from student_voting_portal.views import HybridRouter

router = HybridRouter()

# users
router.register("university", UniversityView)
router.register("users", UserView)
router.add_api_view("me", path("me/", UserOwnerView.as_view(), name="me"))
router.add_api_view("auth", path("authentication/", TokenObtainPairView.as_view(), name="auth"))
router.add_api_view("auth-refresh", path("authentication/refresh/", TokenRefreshView.as_view(), name="auth-refresh"))

# elections
router.register("elections", ElectionView)
router.register("positions", PositionView)
router.register("candidates", CandidateView)
router.add_api_view("votes", path("votes/", VoteCandidateView.as_view(), name="votes"))
router.add_api_view("vote-detail", path("votes/<int:election_id>/", VoteCandidateView.as_view(), name="vote-detail"))

urlpatterns = [
    path("", include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path("admin/", admin.site.urls),
]
