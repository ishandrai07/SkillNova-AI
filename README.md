# SkillNova AI

SkillNova AI is an AI-powered interview preparation platform that analyzes a candidate's resume, self-description, and job description to generate a personalized interview preparation report.

## 🚀 Features

- 🔐 User authentication with JWT
- 📄 Resume PDF upload and text extraction
- 🤖 AI-powered interview analysis using Gemini
- 📊 Job match score
- 💻 Technical interview questions
- 🧠 Behavioral interview questions
- 📌 Skill gap analysis
- 📅 5-day preparation plan
- 📥 ATS-friendly resume PDF generation
- 🛡️ Rate limiting for authentication and report generation

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- PDF-Parse
- Puppeteer

### AI & Validation
- Google Gemini API
- Zod

## 📂 Project Structure

SkillNova-AI/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middlewares/
    │   ├── services/
    │   └── config/
    ├── package.json
    └── .env

## ⚙️ Setup

### 1. Clone the Repository

    git clone https://github.com/ishandrai07/SkillNova-AI.git
    cd SkillNova-AI

### 2. Backend Setup

    cd backend
    npm install

Create a `.env` file:

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_GENAI_API_KEY=your_gemini_api_key

Start the backend:

    npm start

### 3. Frontend Setup

Open another terminal:

    cd frontend
    npm install
    npm run dev

## 🔄 How It Works

    Resume + Job Description + Self Description
                        ↓
                  SkillNova AI
                        ↓
                   Gemini AI
                        ↓
           ┌──────────────────────┐
           │ Match Score          │
           │ Technical Questions  │
           │ Behavioral Questions │
           │ Skill Gaps           │
           │ Preparation Plan     │
           └──────────────────────┘
                        ↓
                Interview Report
                        ↓
              Resume PDF Generation

## 🎯 Purpose

SkillNova AI helps students and job seekers understand how well their profile matches a job and prepare for interviews using personalized AI-generated questions and preparation plans.

## 👨‍💻 Author

Ishand Rai

GitHub: https://github.com/ishandrai07
LinkedIn: https://www.linkedin.com/in/ishand-rai-7a2234302/
