
# Django Backend - README

## 📌 Project Overview
This backend is built using **Django + Django REST Framework + JWT Authentication + PostgreSQL**.

---

## 🚀 Setup Instructions

### 1️⃣ Activate Virtual Environment
```
venv\Scripts\activate   # Windows
```

### 2️⃣ Install Dependencies
```
pip install -r requirements.txt
```

### 3️⃣ Run Migrations
```
python manage.py makemigrations
python manage.py migrate
```

### 4️⃣ Start Django Server
```
python manage.py runserver
```

### 5️⃣ Access Django Admin
```
http://127.0.0.1:8000/admin/
```

---

## 📦 Installed Dependencies (So Far)

```
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
psycopg2-binary
```

---

## 🗄 Database
Backend uses **PostgreSQL**.

### Database Configuration (settings.py)
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'supplychain_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 🔐 Authentication
Backend uses **JWT Authentication**.

Login URL:
```
POST /api/auth/login/
```

---

## 📁 Recommended Location
Place this file in:

```
/backend/README.md
```
