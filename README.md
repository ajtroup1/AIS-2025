# AIS-2025
Official AIS repository for Adam Troup, Uyen Truong, and Ryan Langston

## Contents

1. [Overview](#overview)
2. [Documents](#documents)
3. [App Components](#app-components)

## Overview

MAP (My Applicant Portal) is a fullstack portal application that can manage work experiences, applications, and even use AI to build a tailored resume. This is an early development build that showcases the utility and features possible via an all-in-one career portal.

## Documents

Documentation is segregated into separate files:

- [API](./docs/API.md)
- [Frontend](./docs/FRONTEND.md)
- [Data Diagrams](./docs/DATA.md)

## App Components

- Work Experience Tracker:
  - A CRUD interface / table to record past work experiences
  - These experiences are used to generate a resume that is tailored for a position
- Application Tracker:
  - A CRUD interface / table to record job applications
  - Read, filter, and edit applications in a clean table format
- Resume Builder:
  - Uses a [Hugging Face](https://huggingface.co/) AI model to organize your stored work experiences into a resume that is tailored to a job position
- JWT Authentication:
  - Leverages Django to enforce JWT and best security practices