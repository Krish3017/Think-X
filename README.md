# 🚀 Project Setup Guide (Main Branch)

This repository contains the main application.
Follow the steps below to clone, install dependencies, and run the project locally.

---

## 🧰 Prerequisites

Make sure the following are installed:

- Node.js (v16 or higher)
  https://nodejs.org
- pnpm (package manager)

Install pnpm globally if not installed:

    npm install -g pnpm

Verify installation:

    node -v
    pnpm -v

---

## 📥 Clone the Repository

    git clone <repository-url>
    cd <repository-folder>

---

## 📦 Install Dependencies

    pnpm install

This command installs all required dependencies and creates the node_modules folder.

---

## ▶️ Run the Project (Development)

    pnpm dev

The application will start on the port shown in the terminal
(usually http://localhost:5173).

---

## 🏗️ Build for Production (Optional)

    pnpm build

The production build will be generated in the dist folder.

---

## 👀 Preview Production Build (Optional)

    pnpm preview

---

## 📁 Project Structure

    src/          → Application source code
    public/       → Static assets
    package.json  → Scripts and dependencies

---

## 🧹 Notes

- node_modules is not committed to the repository.
- Always run pnpm install after cloning the project.
- If environment variables are required, create a .env file
  (refer to .env.example if available).

---

## 🛠️ Common Issues

pnpm command not found:

    npm install -g pnpm

App not starting:

    pnpm install
    pnpm dev

---

## 📌 Tech Stack

- React
- Vite
- pnpm
- TypeScript / Tailwind CSS (if applicable)

---

## 📄 License

This project is intended for educational, hackathon, or internal use.
