from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import UserView, UserDetailView, UserOwnerView

urlpatterns = [
    path("users/", UserView.as_view()),
    path("users/<int:pk>", UserDetailView.as_view()),
    path("users/me/", UserOwnerView.as_view()),
    path("authentication/", TokenObtainPairView.as_view()),
    path("authentication/refresh/", TokenRefreshView.as_view()),
]
