# Aethelgard

Team Members:

Rehnuma Tarannum Ramisha | rehnuma.cse.20220204063@aust.edu
Sumona Islam Zerin | sumona.cse.20220204072@aust.edu
Jannatul Mawa | jannatul.cse.20220204074@aust.edu
Siddika Sultana Mitu | siddika.cse.20220204078@aust.edu

Project Live Link: https://aethelgard-ten.vercel.app/
Recorded video: [Insert URL] (Optional)

Table of Contents

- [Project Description]
- [Workflow Overview]
- [Main Features]
- [Technologies Used]
- [System Architecture]
- [Setup Guidelines]
  - [Backend]
  - [Frontend]
- [Running the Application]
- [Deployment Status & Tests]
- [Contribution Table]
- [Screenshots]
- [Limitations / Known Issues]

---

## 1. Project Description

Aethelgard is an immersive, content-driven history portal built with React (frontend) and Laravel (backend), enhanced by a conversational AI. It is a rich, content-driven web platform that serves as a gateway to the past. Designed with a focus on deep engagement, it allows users to navigate through interconnected histories of iconic People, Places, and Events. The centerpiece of Aethelgard is its "Living History" AI, which enables users to hold conversations with detailed historical personas, making learning not just informative, but truly unforgettable.

**Objective:**
The primary goal of Aethelgard is to architect a scalable, content-driven web application that revolutionizes historical education by merging a deeply interconnected database with an advanced conversational AI. The platform is designed to deconstruct complex historical narratives into an intuitive and interactive user experience, moving beyond static data to create a truly immersive learning ecosystem.

Key highlights include:

- Interlinked exploration of historical entities (People, Places, Events) through a relational data model.
- Conversational learning with context-aware AI personas capable of simulating historical figures and eyewitnesses.
- User-specific content discovery with a recommendation engine that suggests relevant topics based on browsing history.

**Target Audience:**

- History Enthusiasts
- Students (High School & University)
- The Casually Curious & Lifelong Learners

---

## 2. Workflow Overview

A high-level overview of the project's folder structure is as follows:

Aethelgard/
├── app/
│ ├── Http/
│ │ ├── Controllers/
│ │ └── Middleware/
│ ├── Models/
│ └── Providers/
├── bootstrap/
├── config/
├── database/
│ ├── factories/
│ ├── migrations/
│ └── seeders/
├── public/
├── resources/
│ ├── css/
│ ├── js/
│ └── views/
├── routes/
├── storage/
├── tests/
└── vendor/
└── README.md

---

## 3. Main Features

### User Authentication & Roles

- Secure login with role-based access (User vs. Admin/Historian).
- Admin dashboard for content management and site analytics.
- Personalized user accounts for saving favorite topics and tracking exploration history.

### Historical Content Hub

- Dynamic exploration of the three core pillars: People, Places, and Events.
- Deeply interlinked content to discover connections between historical figures and key events.
- Advanced search and filtering by era, region, and category.

### Content Analytics & Discovery

- Automatic tracking of user views and likes across all historical entries.
- "Trending Topics" and "Most Popular" sections to enhance user content discovery.
- Admin dashboard with detailed analytics on top-performing articles and engagement patterns.

### Content Management System (Admin)

- Secure interface for administrators to add, edit, and link historical entries.
- Rich text editor for creating detailed descriptions with embedded media.
- Management of relationships within the database (e.g., linking a person to an event).

### AI-Powered Features

- **Dynamic Persona Chat:** Context-aware AI simulates conversations by adopting the persona of the historical figure or eyewitness being viewed.
- **Intelligent Query Analysis:** Natural Language Processing (NLP) enables the AI to understand and respond to complex, open-ended user questions.

### CRUD Operations

The system supports full Create, Read, Update, Delete (CRUD) operations for:

- Historical Figures (People)
- Historical Places
- Historical Events
- Content Categories / Tags

### RESTful API Endpoints (Sample)

| Method   | Endpoint           | Description                                            |
| :------- | :----------------- | :----------------------------------------------------- |
| `GET`    | `/api/people`      | Retrieve a list of all historical figures              |
| `POST`   | `/api/chat`        | Submit a user's message to the AI for a response       |
| `PUT`    | `/api/events/{id}` | Update details for a specific historical event (Admin) |
| `DELETE` | `/api/people/{id}` | Remove a historical figure entry (Admin only)          |

---

## 4. Technologies Used

- **Frontend:** React.js, React Router, Axios, TailwindCSS / Material UI (MUI)
- **Backend:** Laravel 10 (RESTful API), Sanctum (Authentication), OpenAI API (AI Layer)
- **Database:** MySQL
- **Rendering Method:** Client-Side Rendering (CSR) - The entire frontend is rendered in the user's browser using React, consuming historical data and AI responses from the Laravel back-end API.

---

## 5. System Architecture

The system follows a client-server architecture. The Frontend, built with React, interacts with the Backend, a Laravel RESTful API. The Backend handles business logic, communicates with the MySQL database for data storage and retrieval, and integrates with the OpenAI API for AI-powered conversational features. Authentication is managed by Laravel Sanctum.

---

## 6. Setup Guidelines

### Backend

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Install dependencies
composer install

# Setup environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the Laravel development server
php artisan serve

Frontend
# Navigate into your frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run frontend development server
npm start

________________________________________
7. Running the Application
To run the application locally, follow the Setup Guidelines for both the Backend and Frontend.
The live deployed version can be accessed at: https://aethelgard-ten.vercel.app/
________________________________________
8. Deployment Status & Tests
Component	Is Deployed?	Is Dockerized?	Unit Tests Added? (Optional)	Is AI feature implemented? (Optional)
Backend	No	Yes	Yes	Yes
Frontend	Yes	Yes	Yes	Yes
Note: The AI feature is implemented in the backend, hence 'Yes' for Backend and 'No' for Frontend as the frontend consumes the AI output via API.
________________________________________
9. Contribution Table
Metric	                        Total	     Backend	     Frontend  	Rehnuma Tarannum Ramisha	  Sumona Islam Zerin	   Jannatul Mawa	    Siddika Sultana Mitu
Issues Solved	                   51           42            9                 3                       2                    23                     23              
WakaTime Contribution (Hours)							                                    19                      23                   59                     38
Percent Contribution (%)          99.99                                       13.11                   3.28                 37.70                  45.90
Development Activity (WakaTime Badges):
Jannatul Mawa:
![alt text](https://wakatime.com/badge/user/f76851eb-d69c-4349-9076-432483fb64b8/project/7efb2184-4e45-436c-91b9-eaaf27a076c4.svg)

Siddika Sultana Mitu:
![alt text](https://wakatime.com/badge/user/477f582d-9b20-4035-93b6-873e173f480d/project/65c6bb7f-1d8c-4d44-9d61-cef1e7ed51f4.svg)

Sumona Islam Zerin:
![alt text](https://wakatime.com/badge/user/52089f7d-d32f-4e33-a533-7f9c53414b7a/project/2f9eea8c-2fe6-45e0-b8fd-494cefff0f7b.svg)

Rehnuma Tarannum Ramisha:
![alt text](https://wakatime.com/badge/user/867df651-7e86-4c3e-9056-757055655484/project/9926df57-4d8a-408c-af99-42dc0bf8e4ec.svg)
________________________________________
10. Screenshots
## My Project Screenshots

### First Screenshot
![Description of the first screenshot](screenshots/photo_2025-09-21-09-15-14.jpg)

### Second Screenshot
![Description of the second screenshot](screenshots/photo_2025-09-21-09-15-31.jpg)

### Third Screenshot
![Description of the third screenshot](screenshots/photo_2025-09-21-09-15-36.jpg)

### Fourth Screenshot
![Description of the fourth screenshot](screenshots/photo_2025-09-21-09-15-41.jpg)
Live Homepage






Railway Deployment (Aethelgard Service)




Vercel Deployments (Frontend)




404 Error Page Example (If an invalid route is accessed)





________________________________________
11. Limitations / Known Issues
•	Initial AI response time: Depending on the complexity of the query and OpenAI API load, initial AI persona responses might experience slight delays.
•	Content coverage: While extensive, the historical content is continuously being expanded and might not cover every specific niche topic.
•	Recommendation engine: The recommendation engine is currently based on browsing history and can be further enhanced with more sophisticated algorithms for deeper personalization.
```
