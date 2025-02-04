# Managing DB in Django:

1. Create a model in `models.py`:
	- ```py
		class Resume(models.Model):
    		user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="resumes")
    		file = models.FileField(upload_to="resumes/")
    		version = models.PositiveIntegerField()
    		created_at = models.DateTimeField(auto_now_add=True)
	  ```
2. After the model is in the file, run 2 commands to migrate:
  - ```bash
      ...\backend> python manage.py makemigrations

      ...\backend> python manage.py migrate
     ```