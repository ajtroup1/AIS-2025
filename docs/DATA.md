# Data

This document is on verion `1.1`

This document is on verion `1.1`

This file is responsible for representing the data structures used in ____. Below are the [Entity Relationship Diagram](#entity-relations) and the [Class Diagram](#class-diagram)

*Rendered with [Mermaid](https://mermaid.js.org/)*

## Entity Relations

```mermaid
erDiagram
    USER {
        VARCHAR username NOT NULL PK
        VARCHAR username NOT NULL PK
        VARCHAR password NOT NULL
        VARCHAR email
    }
    EXPERIENCE{
        INT experience_id NOT NULL PK
        VARCHAR job_title NOT NULL
        VARCHAR company NOT NULL
        ENUM job_type NOT NULL
        DATE from_date NOT NULL
        DATE to_date
        VARCHAR city
        VARCHAR state
        ENUM skills
        ENUM techonology
        INT user_id FK
    }
    RESUME {
        INT resume_id NOT NULL PK
        DATE date_compiled NOT NULL
        VARCHAR resume_name NOT NULL
        VARCHAR filepath NOT NULL
        INT resume_id NOT NULL PK
        DATE date_compiled NOT NULL
        VARCHAR resume_name NOT NULL
        VARCHAR filepath NOT NULL
        TEXT content
        INT user_id FK
    }
    RES_EXP {
        INT resume_id NOT NULL FK
        INT experience_id NOT NULL FK
    }
    APPLICATION {
        INT app_id NOT NULL PK
        VARCHAR job_title NOT NULL
        VARCHAR company NOT NULL
        ENUM status NOT NULL
        DATE submittedDate NOT NULL
        ENUM job_type
        VARCHAR city
        VARCHAR state
        TEXT job_description
        INT user_id FK
        INT resume_id FK
    }

    USER ||--o{ EXPERIENCE : "has"
    USER ||--o{ RESUME : "has"
    USER ||--o{ APPLICATION : "has"
    EXPERIENCE ||--o{ RES_EXP : "appears on"
    RESUME ||--|{ RES_EXP : "contains"
    RESUME ||--o{ APPLICATION : "used in"
```

## Class Diagram

```mermaid
classDiagram
    class USER {
        +VARCHAR username PK
        +VARCHAR password
        +VARCHAR email
        +login(): void
        +logout(): void
        +signup(): void
        +updateProfile(newEmail: VARCHAR): void
    }

    class EXPERIENCE {
        +INT experience_id PK
        +VARCHAR job_title
        +VARCHAR company
        +ENUM job_type
        +DATE from_date
        +DATE to_date
        +VARCHAR city
        +VARCHAR state
        +ENUM skills
        +ENUM technology
        +INT user_id FK
        +addExperience(newExperience: EXPERIENCE): void
        +getAllExperiences(): EXPERIENCE[]
        +getExperienceById(exp_id: INT): EXPERIENCE
        +updateExperience(exp_id: INT): void
    }

    class RESUME {
        +INT resume_id PK
        +DATE date_compiled
        +VARCHAR resume_name
        +VARCHAR filepath
        +TEXT content
        +INT user_id FK
        +addResume(newResume: RESUME): void
        +getAllResumes(): RESUME[]
        +getResumeById(res_id: INT): RESUME
        +updateResume(res_id: INT): void
    }

    class RES_EXP {
        +INT resume_id FK
        +INT experience_id FK
    }

    class APPLICATION {
        +INT app_id PK
        +VARCHAR job_title
        +VARCHAR company
        +ENUM status
        +DATE submittedDate
        +ENUM job_type
        +VARCHAR city
        +VARCHAR state
        +TEXT job_description
        +INT user_id FK
        +INT resume_id FK
        +addApplication(newApplication: APPLICATION): void
        +getAllApplications(): APPLICATION[]
        +getApplicationById(app_id: INT): APPLICATION
        +updateApplication(app_id: INT): void
    }

    USER "1" -- "0..*" EXPERIENCE : has
    USER "1" -- "0..*" RESUME : has
    USER "1" -- "0..*" APPLICATION : has
    EXPERIENCE "1" -- "0..*" RES_EXP : appears on
    RESUME "1" -- "1..*" RES_EXP : contains
    RESUME "1" -- "0..*" APPLICATION : used in

```