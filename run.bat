@echo off
echo Running backend server...
start cmd /k "cd backend && python manage.py runserver"

echo Running frontend...
start cmd /k "cd frontend && npm run dev"

echo Serving...
