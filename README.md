# Chakradhar Peela — Engineering & Robotics Portfolio

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, futuristic personal portfolio website featuring a dark cockpit HUD design inspired by LaunchDarkly, interactive physics-based cards, live interactive projects showcase, and responsive layout.

---

## 🚀 Overview

This repository hosts the personal portfolio of **Chakradhar Peela**, an Electronics and Communication Engineer specializing in **Autonomous Robotics, Computer Vision, Edge AI, and Embedded Hardware Architectures**.

### Key Highlights
- **LaunchDarkly Cockpit HUD Aesthetic**: Deep charcoal canvases (`#0e0e0e`), glowing neon violet accents (`#405bff` to `#7084ff`), and hairline borders.
- **Interactive Project Showcase**: Detailed breakdowns of flagship robotics projects, including:
  - **NeuralArm**: 6-DOF bio-mimetic robotic manipulator.
  - **A.R.E.S (Autonomous Reconnaissance & Exploration System)**: SLAM & autonomous navigation rover.
  - **Face Recognition Attendance System**: Real-time edge video analytics.
  - **VoiceAI & N8N Automation**: LLM-driven autonomous workflows.
- **VectorCraft Interactive HUD**: Embedded interactive components with dynamic measurement rulers and telemetry overlays.
- **Optimized Performance**: Zero heavy dependencies, pure vanilla HTML5, CSS3, and modern JavaScript for instant load times and 60 FPS animations.

---

## 🛠️ Tech Stack

- **Markup & Styling**: Semantic HTML5, CSS Variables, Flexbox/CSS Grid, Glassmorphism, Neon glow filters.
- **Scripting**: Vanilla ECMAScript 6+ with IntersectionObserver for scroll triggers and interactive HUD controls.
- **Fonts**: Custom Grotesk & JetBrains Mono for a clean developer terminal feel.
- **Deployment**: Vercel serverless static edge network with automated routing (`vercel.json`).

---

## 📁 Repository Structure

```text
portfolio-website/
├── index.html              # Main single-page application & HUD
├── styles.css              # Custom styling, dark theme tokens & keyframes
├── script.js               # HUD animations, scroll interactions & filters
├── vercel.json             # Vercel deployment and routing configuration
├── package.json            # Node.js project metadata & local preview script
├── assets/                 # Icons, SVG vectors, and UI badges
├── profile.jpeg            # Author biography portrait
├── resume.pdf              # Curriculum Vitae
└── README.md               # Project documentation
```

---

## ⚡ Quick Start

### Local Development
To preview the website locally on your computer:

```bash
# Clone the repository
git clone https://github.com/entusedglue3125/portfolio-website.git
cd portfolio-website

# Option 1: Using Python built-in HTTP server
python3 -m http.server 3000

# Option 2: Using Node.js npx serve
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Deployment to Vercel
Deploy seamlessly using the Vercel CLI:
```bash
npx vercel --prod
```

---

## 📬 Contact & Connect

- **Author**: Chakradhar Peela
- **GitHub**: [@entusedglue3125](https://github.com/entusedglue3125)
- **Email**: [peelachakradhar@gmail.com](mailto:peelachakradhar@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
