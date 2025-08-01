# Aethelgard
<hr>
Aethelgard is an immersive, content-driven history portal built with React (frontend) and Laravel (backend), enhanced by a conversational AI.
<hr>

## 🎯 Objective

The primary goal of Aethelgard is to architect a scalable, content-driven web application that revolutionizes historical education by merging a deeply interconnected database with an advanced conversational AI. The platform is designed to deconstruct complex historical narratives into an intuitive and interactive user experience, moving beyond static data to create a truly immersive learning ecosystem.

Key highlights include:
*   Interlinked exploration of historical entities (People, Places, Events) through a relational data model.
*   Conversational learning with context-aware AI personas capable of simulating historical figures and eyewitnesses.
*   User-specific content discovery with a recommendation engine that suggests relevant topics based on browsing history.

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
*   **Laravel 10 (RESTful API):** A modern PHP framework for building the secure, scalable back-end.
*   **Sanctum (Authentication):** Laravel's lightweight system for API token-based authentication.
*   **MySQL (Database):** A robust, open-source relational database for storing all historical and user data.
*   **OpenAI API (AI Layer):** Integrated directly via Laravel's HTTP client to power the conversational AI engine.

### 🌐 Frontend
*   **React.js:** The core JavaScript library for building the dynamic and interactive user interface.
*   **React Router:** For handling all client-side routing and navigation between pages.
*   **Axios (API calls):** A promise-based client for communicating with the Laravel back-end API.
*   **TailwindCSS / Material UI (MUI):** For crafting a clean, responsive, and modern design system.

### ⚙️ Rendering Method
*   **Client-Side Rendering (CSR):**
    The entire frontend is rendered in the user's browser using React, consuming historical data and AI responses from the Laravel back-end API.