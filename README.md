# Aethelgard
<hr>
Aethelgard is an immersive, content-driven history portal built with React (frontend) and Laravel (backend), enhanced by a conversational AI.
<hr>

## 📌 Project Overview

Aethelgard is a rich, content-driven web platform that serves as a gateway to the past. Designed with a focus on deep engagement, it allows users to navigate through interconnected histories of iconic People, Places, and Events. The centerpiece of Aethelgard is its "Living History" AI, which enables users to hold conversations with detailed historical personas, making learning not just informative, but truly unforgettable.
<hr>

## 🎯 Objective

The primary goal of Aethelgard is to architect a scalable, content-driven web application that revolutionizes historical education by merging a deeply interconnected database with an advanced conversational AI. The platform is designed to deconstruct complex historical narratives into an intuitive and interactive user experience, moving beyond static data to create a truly immersive learning ecosystem.

Key highlights include:
*   Interlinked exploration of historical entities (People, Places, Events) through a relational data model.
*   Conversational learning with context-aware AI personas capable of simulating historical figures and eyewitnesses.
*   User-specific content discovery with a recommendation engine that suggests relevant topics based on browsing history.

<hr>


## 📊 Development Activity

Track real-time coding progress:
[![wakatime](https://wakatime.com/badge/user/f76851eb-d69c-4349-9076-432483fb64b8/project/7efb2184-4e45-436c-91b9-eaaf27a076c4.svg)](https://wakatime.com/badge/user/f76851eb-d69c-4349-9076-432483fb64b8/project/7efb2184-4e45-436c-91b9-eaaf27a076c4)
<hr>

## 👥 Target Audience
*   History Enthusiasts
*   Students (High School & University)
*   The Casually Curious & Lifelong Learners

<hr>

## ✨ Core Features & Platform Modules

### 🔒 User Authentication & Roles
*   Secure login with role-based access (User vs. Admin/Historian).
*   Admin dashboard for content management and site analytics.
*   Personalized user accounts for saving favorite topics and tracking exploration history.

### 🌐 Historical Content Hub
*   Dynamic exploration of the three core pillars: People, Places, and Events.
*   Deeply interlinked content to discover connections between historical figures and key events.
*   Advanced search and filtering by era, region, and category.

### 📊 Content Analytics & Discovery
*   Automatic tracking of user views and likes across all historical entries.
*   "Trending Topics" and "Most Popular" sections to enhance user content discovery.
*   Admin dashboard with detailed analytics on top-performing articles and engagement patterns.

### ⚙️ Content Management System (Admin)
*   Secure interface for administrators to add, edit, and link historical entries.
*   Rich text editor for creating detailed descriptions with embedded media.
*   Management of relationships within the database (e.g., linking a person to an event).

<hr>

## 🤖 AI-Powered Features

1.  **Dynamic Persona Chat**
    *   Context-aware AI simulates conversations by adopting the persona of the historical figure or eyewitness being viewed.
2.  **Intelligent Query Analysis**
    *   Natural Language Processing (NLP) enables the AI to understand and respond to complex, open-ended user questions.

<hr>

## CRUD Operations
The system supports full Create, Read, Update, Delete (CRUD) operations:

| Module                      | Actions Supported               |
| --------------------------- | ------------------------------- |
| Historical Figures (People) | Create, Read, Update, Delete    |
| Historical Places           | Create, Read, Update, Delete    |
| Historical Events           | Create, Read, Update, Delete    |
| Content Categories / Tags   | Create, Read, Update, Delete    |

<hr>

## 🔗 RESTful API Endpoints (Sample)

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/api/people`        | Retrieve a list of all historical figures    |
| POST   | `/api/chat`          | Submit a user's message to the AI for a response |
| PUT    | `/api/events/{id}`   | Update details for a specific historical event (Admin) |
| DELETE | `/api/people/{id}`   | Remove a historical figure entry (Admin only) |

<hr>

## 🔮 Future Enhancements

### Interactive Historical Atlas
The platform will incorporate a dynamic, map-based interface allowing users to visualize geopolitical changes over centuries, providing powerful geographic and temporal context for historical events.

<hr>

## 🛠 Technology Stack

### ⬅️ Backend
*   **Laravel 10 (RESTful API):** 
*   **Sanctum (Authentication):** 
*   **MySQL (Database):** 
*   **OpenAI API (AI Layer):** 

### 🌐 Frontend
*   **React.js:** 
*   **React Router:** 
*   **Axios (API calls):** 
*   **TailwindCSS / Material UI (MUI):** 

### ⚙️ Rendering Method
*   **Client-Side Rendering (CSR):**
    The entire frontend is rendered in the user's browser using React, consuming historical data and AI responses from the Laravel back-end API.
    <hr>

## 📷 Key Screens
*   **Login & Registration:** Secure authentication screens for user and administrator access.
*   **The Discovery Dashboard:** A dynamic, personalized hub showcasing trending topics, featured content, and recommendations.
*   **Interactive Content Pages:** Detailed pages for each Person, Place, and Event, featuring the integrated AI persona chat.
*   **Comprehensive Admin Panel:** A secure back-office with full CRUD control over all site content and user management.

<hr>

## 🔗 UI Design Prototype (Figma)
View the full design on Figma:
[🔗 Aethelgard Figma Design](https://www.figma.com/design/WTwOHx4wF8CMn2VrnSePlp/AETHELGARD?node-id=0-1&p=f&t=F7H56o5M2qUA7LJ9-0)

<hr>

## 👩‍💻 Contributors
*   Rehnuma Tarannum Ramisha (ID - 20220204063)
*   Sumona Islam Zerin (ID - 20220204072)
*   Jannatul Mawa (ID - 20220204074)
*   Siddika Sultana Mitu (ID - 20220204078)

<hr>

## 📄 License
This project is intended for academic and educational purposes. Feel free to fork and modify for your own use.