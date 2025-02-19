@echo Running backend...
start cmd /k python ./backend/manage.py runserver

@echo Running frontend...
start cmd /k cd frontend && npm run dev

@echo Both backend and frontend are running!
pause

@echo Terminated...