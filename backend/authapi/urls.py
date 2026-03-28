from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from django.urls import re_path
import os   # ✅ REQUIRED (ADDED)
from django.urls import path
from .views import stock_report


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
    
    # REPORTS
     path('stock-report/', stock_report),

]

# ✅ EXISTING MEDIA CONFIG (UNCHANGED)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# ✅ CUSTOM FILE SERVING (ADDED SAFELY)
if settings.DEBUG:
    urlpatterns += [
        re_path(
            r'^Project_Master_LOA_Agreement_Document_Upload/(?P<path>.*)$',
            serve,
            {
                'document_root': os.path.join(
                    settings.BASE_DIR,
                    'Project_Master_LOA_Agreement_Document_Upload'
                )
            }
        ),
    ]