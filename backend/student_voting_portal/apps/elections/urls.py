from django.urls import path

from elections.views import ElectionView, PositionView, CandidateView

urlpatterns = [
    path("elections/", ElectionView.as_view()),
    path("positions/", PositionView.as_view()),
    path("candidates/", CandidateView.as_view()),
]
