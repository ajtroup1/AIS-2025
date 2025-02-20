# Quick Start

1. Ensure you are in the root folder ex. `C:\things-and-such\AIS-2025>`

2. Run `python manage.py migrate` to ensure the data is up to date in the database

3. Run `.\run.bat` to boot up both servers (frontend and backend)
  - This automatically opens 2 terminals to manage both servers

4. The second terminal should say something like:
```bash
  VITE v6.0.11  ready in 269 ms

  ➜  Local:   http://localhost:5173/ <---- CTRL+Click here to open the frontend client in the browser
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
  - Hold CTRL and click the localhost link

5. Now you should be on the web client with a running backend server automatically!