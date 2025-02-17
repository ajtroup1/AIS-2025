import requests
from sentence_transformers import SentenceTransformer, util

# Login for Auth
loginURL = "http://127.0.0.1:8000/api/login/"
loginCred = {
    "email": "htruong@crimson.ua.edu",
    "password": "Yay123456789!"
}
mockLoginResponse = requests.post(loginURL, json=loginCred)

# Auth
if mockLoginResponse.status_code == 200:
    access_token = mockLoginResponse.json().get('access')  # Safely access 'access' key
else:
    print(f"Login failed: {mockLoginResponse.status_code}, {mockLoginResponse.text}")

# Get All Experiences
getExperiencesURL = "http://127.0.0.1:8000/api/experiences/"
# Pass access token into header of the API call
headers = {
    "Authorization": f"Bearer {access_token}"
}
getExperiencesResponse = requests.get(getExperiencesURL, headers=headers)

# Extract the returned data
rawData = []
if getExperiencesResponse.status_code == 200:
    rawData = getExperiencesResponse.json()
    # print(rawData)
else:
    print(f"Error: {getExperiencesResponse.status_code}, {getExperiencesResponse.text}")

# Loop through the experiences json objects and transform the data into a list of objects with structure:
    # exp_id: id of the experience
    # exp_data: parse the experience json into text
transformed = []
for exp in rawData:
    # Ensure exp is a dictionary and we access it using the key
    i = {
        "exp_id": exp.get('id'),  # Use 'get' to avoid KeyError
        "exp_data": f"{exp.get('job_title', 'N/A')} - {exp.get('description', 'N/A')}",  # Use f-string for readability
        "similarity_score": 0
    }
    transformed.append(i)
# print(transformed)

# Compare similarity between job_posting and each of your experiences
job_posting = """Are you passionate about building scalable, high-performance applications? We’re looking for a Software Engineer to join our backend development team and help us design, develop, and optimize our cloud-based platforms. In this role, you’ll work with a talented group of engineers to build robust APIs, improve system architecture, and implement best coding practices to ensure seamless user experiences.

Responsibilities:
- Develop and maintain backend services, APIs, and databases to support our web and mobile applications.
- Collaborate with frontend engineers, designers, and product managers to deliver high-quality features.
- Optimize application performance, scalability, and security.
- Write clean, efficient, and well-documented code following industry best practices.
- Debug, troubleshoot, and resolve technical issues as they arise.

Requirements:
- Proficiency in Python, Node.js, or Java with experience in backend frameworks such as Django, Express.js, or Spring Boot.
- Strong understanding of RESTful APIs, microservices, and database design (SQL & NoSQL).
- Experience working with cloud platforms like AWS, GCP, or Azure.
- Knowledge of authentication protocols (OAuth, JWT) and security best practices.
- Strong problem-solving skills and ability to work both independently and in a team environment.

If you’re excited to work on cutting-edge technology and make an impact in a fast-growing company, apply today! 🚀"""


# MODEL FOR RELEVANT RANKING OF THE EXPERIENCES TO THE JOB POSTING
model = SentenceTransformer("sentence-transformers/msmarco-MiniLM-L6-cos-v5")

# Encode job posting and experiences
job_embedding = model.encode(job_posting, convert_to_tensor=True)
experience_embeddings = model.encode([exp["exp_data"] for exp in transformed], convert_to_tensor=True)

# Compute similarity scores
similarity_scores = util.pytorch_cos_sim(job_embedding, experience_embeddings)[0]

# Update experience data with similarity scores
for i, exp in enumerate(transformed):
    exp["similarity_score"] = similarity_scores[i].item()  # Convert tensor to Python float

# Sort experiences by similarity score (descending)
top_5_experiences = sorted(transformed, key=lambda x: x["similarity_score"], reverse=True)[:5]

for exp in top_5_experiences:
    print(exp["exp_id"])