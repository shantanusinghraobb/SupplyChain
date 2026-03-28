from urllib import request

from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import re
from django.db.models import Max
from .models import GRNHeader
from .models import Stock, GRNItem
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MaterialMaster
from .serializers import MaterialMasterSerializer
    
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ProjectMaster
from .serializers import ProjectMasterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GRNHeader
from .serializers import GRNHeaderSerializer
from django.db.models import Max
from .models import GRNHeader
import os
from django.conf import settings
import time
import datetime
import re
from .models import ProjectMaster
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response


from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection



class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        login(request, user)

        return Response(
            {
                "message": "Login successful",
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_200_OK
        )

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MaterialMaster
from .serializers import MaterialMasterSerializer


class MaterialMasterListView(APIView):

    def get(self, request):
        materials = MaterialMaster.objects.all().order_by("id")
        serializer = MaterialMasterSerializer(materials, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MaterialMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class MaterialMasterDetailView(APIView):

    def put(self, request, pk):
        try:
            material = MaterialMaster.objects.get(id=pk)
        except MaterialMaster.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        serializer = MaterialMasterSerializer(material, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            material = MaterialMaster.objects.get(id=pk)
            material.delete()
            return Response({"message": "Deleted successfully"}, status=200)
        except MaterialMaster.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

class ProjectMasterListView(APIView):

    def get(self, request):
        projects = ProjectMaster.objects.all()
        serializer = ProjectMasterSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        data._mutable = True

        # 🔥 HANDLE MULTIPLE FILES
        files = request.FILES.getlist("document")

        file_paths = []

        for file in files:
            # 🔥 GET FILE EXTENSION
            ext = file.name.split(".")[-1]

            allowed_extensions = ["pdf", "xls", "xlsx", "jpg", "jpeg", "png"]

            if ext.lower() not in allowed_extensions:
                return Response(
                    {"error": f"{file.name} is not a supported file type"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 🔥 CREATE UNIQUE NAME
           

            # 🔥 GET FORM VALUES
            site_name = data.get("site_name", "")
            contact_person = data.get("contact_person", "")

            # 🔥 CLEAN VALUES
            site_first = site_name.split(" ")[0] if site_name else "SITE"
            contact_first = contact_person.split(" ")[0] if contact_person else "USER"

            # REMOVE SPECIAL CHARACTERS
            site_first = re.sub(r'[^A-Za-z0-9]', '', site_first)
            contact_first = re.sub(r'[^A-Za-z0-9]', '', contact_first)

            # 🔥 DATE
            today = datetime.datetime.now().strftime("%Y%m%d")

            # 🔥 DOCUMENT TYPE (from filename)
            doc_type = file.name.split(".")[0].split("_")[0]  # first word of uploaded file
            doc_type = re.sub(r'[^A-Za-z0-9]', '', doc_type)

            # 🔥 SERIAL COUNT (GLOBAL)
            total_docs = len(ProjectMaster.objects.all()) + 1

            # 🔥 RUNNING NUMBER (PER DAY)
            existing_files_count = len(file_paths) + 1

            # 🔥 FINAL NAME
            unique_name = f"{total_docs}_{doc_type}_{site_first}_{contact_first}_{today}_{str(existing_files_count).zfill(3)}.{ext}"

            file_path = os.path.join(settings.MEDIA_ROOT, unique_name)

            # SAVE FILE
            with open(file_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            # STORE RELATIVE PATH
            relative_path = f"Project_Master_LOA_Agreement_Document_Upload/{unique_name}"
            file_paths.append(relative_path)

        # ✅ STORE AS JSON STRING IN DB
        import json
        if file_paths:
            data["document"] = json.dumps(file_paths)

        serializer = ProjectMasterSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("❌ SERIALIZER ERROR:", serializer.errors)   # 🔥 ADD THIS LINE
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            project = ProjectMaster.objects.get(id=pk)
            project.delete()
            return Response({"message": "Deleted successfully"}, status=200)
        except ProjectMaster.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

class GRNView(APIView):

    def get(self, request):
        grns = GRNHeader.objects.all().order_by("-id")
        serializer = GRNHeaderSerializer(grns, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()

        # 🔥 AUTO GENERATE GRN NUMBER
        data["grn_no"] = generate_next_grn_number()

        serializer = GRNHeaderSerializer(data=data)

        if serializer.is_valid():
            grn = serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("❌ SERIALIZER ERROR:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



def generate_next_grn_number():
    last_grn = GRNHeader.objects.order_by("-id").first()

    if not last_grn:
        return "GRN001PLATE"

    next_number = last_grn.id + 1
    return f"GRN{str(next_number).zfill(3)}PLATE"




class NextGRNNumberView(APIView):
    def get(self, request):
        next_number = generate_next_grn_number()
        return Response({"grn_no": next_number})



@api_view(['GET'])
def stock_report(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                id,
                item_code,
                description,
                unit,
                unique_item_id,

                length,
                width,
                thickness,

                challan_qty,
                total_qty,
                balance_qty,
                       
                weight,   -- ✅ ADD THIS

                created_at
            FROM stock
            ORDER BY id DESC
        """)

        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return Response(data)