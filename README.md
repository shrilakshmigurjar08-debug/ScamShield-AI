# ScamShield AI 🛡️

**ScamShield AI** is a unified, AI-powered fraud detection platform designed to protect users from phishing websites, fake job offers, fraudulent emails, and deceptive messages. 

Instead of relying on fragmented, platform-specific security tools, ScamShield AI provides a centralized dashboard that analyzes URLs, emails, documents, and SMS messages using machine learning, natural language processing (NLP), and global threat intelligence.

## 🚀 Key Features

* **Multi-Vector Threat Detection:** Analyze URLs, text messages, emails, and files from a single unified interface.
* **AI-Powered Analysis:** Utilizes NLP to detect artificial urgency, credential harvesting requests, and deceptive language patterns.
* **Heuristic Risk Scoring:** Generates a comprehensive risk score (0-100) based on domain age, SSL validity, and hidden redirects.
* **Forensic Evidence Breakdown:** Provides transparent, easy-to-understand explanations of exactly *why* a threat was flagged.
* **Threat Intelligence Sync:** Cross-references data with known phishing databases and global threat registries.

## 💻 Tech Stack

### Frontend (Current Phase)
* **Framework:** React 19 / Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Language:** TypeScript

### Backend & AI (Planned Integration)
* **API:** Python (FastAPI) or Node.js (Express)
* **Machine Learning:** Custom NLP models for text classification
* **Heuristics:** Web scraping and domain registry verification logic
* **Database:** PostgreSQL or MongoDB for historical scan telemetry

## 🛠️ Getting Started (Local Development)

Currently, the project is in the **Frontend MVP phase**, utilizing mock datasets to simulate API responses and AI analysis.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd scamshield-ai

Install dependencies:

Bash
npm install

Start the development server:
Bash
npm run dev
Open your browser and navigate to http://localhost:5173
