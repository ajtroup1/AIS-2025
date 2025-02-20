# API

This document is version `1.0`

## Contents
1. [Overview](#overview)
2. [Authorization](#authorization)
    - [JWT Resources](#jwt-resources)
3. [Quick Start](#quick-start)
4. [Routes](#routes)
    - [User Routes](#user-routes)


## Overview
The API for ___ is implemented in Python's [Django](https://www.djangoproject.com/). This allows for flexible & speedy development, readable & maintainable code, and an [ORM](https://www.freecodecamp.org/news/what-is-an-orm-the-meaning-of-object-relational-mapping-database-tools/) database architecture. Django is also extremely powerful out-of-the-box, with features such as: a built-in admin portal, simple model creation and native migration support, and versatile view and routing tools. 

## Authorization
____'s api uses a JWT authentication system for all requests. JWT authentication uses a flow where you initially authenticate upon login, then refresh your access to the api if needed. To further learn about JWT, see the [resources below](#jwt-resources). 

**Note that the access and refresh tokens in the examples are NOT valid and will not work for you, you must generate your own**

Upon a successful login, you will be returned a JWT access token and a refresh token:
```json
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Mjc1MTU1LCJpYXQiOjE3MzgyNzMzNTUsImp0aSI6Ijc0NTYyYjZkNmQ1ZDRmMGU4YWQ1ZWRiYjlkN2VhNWE3IiwidXNlcl9pZCI6MX0.aVqXsnd_BLUeo-SwhgU6SSGeDAlIXt-vRUWGoG58UlI",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczODg3ODE1NSwiaWF0IjoxNzM4MjczMzU1LCJqdGkiOiJlYTc5ZjExNjNjZGY0YzRiOTA1NmVjMWI0YmIxMTE1MSIsInVzZXJfaWQiOjF9.Ngh37_76caW-QC6cDo8wQGeQpJRCQhuIWy9MU-9-Mlw"
}
```

Once you are granted a token, you can send the access token with your api requests to authenticate yourself.
Attach the below parameter as a header in your request:
```json
{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Mjc1MTU1LCJpYXQiOjE3MzgyNzMzNTUsImp0aSI6Ijc0NTYyYjZkNmQ1ZDRmMGU4YWQ1ZWRiYjlkN2VhNWE3IiwidXNlcl9pZCI6MX0.aVqXsnd_BLUeo-SwhgU6SSGeDAlIXt-vRUWGoG58UlI"}
```

If your token has expired or is invalid for any reason you will see this error:
```json
{
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
        {
            "token_class": "AccessToken",
            "token_type": "access",
            "message": "Token is invalid or expired"
        }
    ]
}
```

That means it's time to refresh your token now. This is as simple as making a request to `/api/refresh/` with your refresh token.

REQUEST:
```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczODg3ODE1NSwiaWF0IjoxNzM4MjczMzU1LCJqdGkiOiJlYTc5ZjExNjNjZGY0YzRiOTA1NmVjMWI0YmIxMTE1MSIsInVzZXJfaWQiOjF9.Ngh37_76caW-QC6cDo8wQGeQpJRCQhuIWy9MU-9-Mlw"
}
```

RESPONSE:
```json
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Mjc3OTk2LCJpYXQiOjE3MzgyNzMzNTUsImp0aSI6ImZhYWQwMTUwYmUyYTRmMzhiMzFjMDkwOTAxYjc0ZmY5IiwidXNlcl9pZCI6MX0.goxxjeOTt4GUSToOgI_8d7VL3iyj9ObwsUfuk-trAuU"
}
```

#### JWT Resources
- [Official JWT Site](https://jwt.io/)
- [Tech With Tim - JWT Explaination](https://www.youtube.com/watch?v=vLTJ_03Dq4M)
- [JWT Wiki](https://en.wikipedia.org/wiki/JSON_Web_Token)


## Quick Start

*Examples shown are done in [Postman](https://www.postman.com/)*

1. Register an account:
- <img src="./imgs/Screenshot 2025-02-18 184710.png" style="width: 100%" />
- Expects:
    - A username
    - An email
    - A password
        - Will be hashed before storage and during comparison
    - [Constraints](#http-responses)
2. Login to your account:
- <img src="./imgs/Screenshot 2025-02-18 185144.png" style="width: 100%" />
- Expects:
    - An "email", which can be either your usename or email
    - Your password
- Returns:
    - Your access token to use during every request and the refresh token to renew it
        - <img src="./imgs/Screenshot 2025-02-18 185444.png" style="width: 100%" />

## Routes
The routes for the api are all accessible through the `/api` url route (ex. `http://127.0.0.1:8000/api/update-job-listing/1`).

### User Routes
- POST `/register`
    - Registers a user in the database given the correct information.
    - Make an HTTP Request:
        - ```json
          {
              "username": "ExampleUser",
              "email": "myemail@gmail.com",
              "password": "Password123!"
          }
          ```
    - #### HTTP Responses:
        - `201 Created` Successfully registered the user.
        - `400 Bad Request` A number of issues could have occured:
            - Username is already taken
            - Username is less than 3 characters
            - Email is already registered to an account
            - Email is invalid (no `@` or `.com`, `.to`, ...)
            - Password is less than 8 characters
            - Password does not contain at least one uppercase letter
            - Password does not contain at least one number
            - Password does not contain at least one special character
- POST `/login`
    - Logs the user in given the correct username/email and password. Additionally returns an access and refresh token for the user's session.
    - Making an HTTP request:
        - ```json
          {
              "email": "myemail@gmail.com",
              "password": "Password123!"
          }
          ```
        - ```json
          {
              "email": "ExampleUser",
              "password": "Password123!"
          }
          ```
    - HTTP Responses:
        - `200 OK` Successfully logged in the user and returned JWT tokens.
            - ```json
              {
                  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Mjc1MTU1LCJpYXQiOjE3MzgyNzMzNTUsImp0aSI6Ijc0NTYyYjZkNmQ1ZDRmMGU4YWQ1ZWRiYjlkN2VhNWE3IiwidXNlcl9pZCI6MX0.aVqXsnd_BLUeo-SwhgU6SSGeDAlIXt-vRUWGoG58UlI",
                  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczODg3ODE1NSwiaWF0IjoxNzM4MjczMzU1LCJqdGkiOiJlYTc5ZjExNjNjZGY0YzRiOTA1NmVjMWI0YmIxMTE1MSIsInVzZXJfaWQiOjF9.Ngh37_76caW-QC6cDo8wQGeQpJRCQhuIWy9MU-9-Mlw"
              }
              ```
        - `401 Unauthorized` Invalid credentials.
