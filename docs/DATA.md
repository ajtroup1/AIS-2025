# Data

This file is responsible for representing the data structures used in ____. Below are the [Entity Relationship Diagram](#entity-relations) and the [Class Diagram](#class-diagram)

*Rendered with [Mermaid](https://mermaid.js.org/)*

## Entity Relations

```mermaid
erDiagram
    USER {
        INT id PK
        VARCHAR username NOT NULL
        VARCHAR password NOT NULL
        VARCHAR email
    }
    JOB_LISTING {
        INT id PK
        int user_id FK
        VARCHAR position NOT NULL
        VARCHAR company NOT NULL
        DATE appliedWhen NOT NULL
        ENUM status
        TEXT notes
    }
    RESUME {
        INT id PK
        USER_ID user_id FK
        DATE date_uploaded NOT NULL
        VARCHAR version_name
        VARCHAR filepath
        TEXT content
    }
    USER ||--o{ JOB_LISTING : "tracks"
    USER ||--o{ RESUME : "creates"
```

## Class Diagram

```mermaid
classDiagram
    class User {
        - int id
        - string username
        - string password
        - string email
        + editUserInformation(id int, string username, password, email)
        + createJobListing(JobListing listing)
        + uploadResume(Resume resume)
    }
    class JobListing {
        - int id
        - int user_id
        - string company
        - string position
        - datetime appliedWhen
        - enum status
        - string notes

        + updateStatus(int newStatus)
        + addNotes(string newNotes)
    }
    class Resume {
        - int id
        - string versionName
        - string content
        - string filePath
        - datetime createdAt
    }

    User "1" --> "0..*" JobListing : "tracks"
    User "1" --> "0..*" Resume : "creates"
```