from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import (
    LoginView,
    MaterialMasterListView,
    MaterialMasterDetailView,   # ✅ ADD THIS
    ProjectMasterListView,
    GRNView,
    NextGRNNumberView
)

urlpatterns = [
    path('login/', LoginView.as_view()),

    # ✅ MATERIAL MASTER
    path("materials/", MaterialMasterListView.as_view(), name="materials-list"),
    #path("api/materials/<int:pk>/", MaterialMasterDetailView.as_view()),

    # PROJECT
    path("projects/", ProjectMasterListView.as_view(), name="project-list"),
    path("projects/<int:pk>/", ProjectMasterListView.as_view()),

    # GRN
    path("grn/", GRNView.as_view(), name="grn"),
    path("grn/next-number/", NextGRNNumberView.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)