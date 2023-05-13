from django.urls import path, include

from elections.views import ElectionView, PositionView, CandidateView, VoteView

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("elections", ElectionView)
router.register("positions", PositionView)
router.register("candidates", CandidateView)

urlpatterns = [
    path("", include(router.urls)),
    path("vote/", VoteView.as_view()),
]
