from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import UserView

urlpatterns = [
    path("users/", UserView.as_view()),
    path("authentication/", TokenObtainPairView.as_view()),
    path("authentication/refresh/", TokenRefreshView.as_view()),
]
