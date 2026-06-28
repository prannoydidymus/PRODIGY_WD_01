# PRODIGY_WD_01: Responsive Landing Page

This repository contains **Task-01** for the Prodigy InfoTech Web Development Internship. 

The goal of this task is to build a responsive landing page featuring a fixed interactive navigation menu that updates its style (colors, transparency, and structure) dynamically upon scroll and hover, using HTML, CSS, and vanilla JavaScript.

---

## 🌟 Live Demo & Concept
We designed a high-end, premium landing page for **Aether**, a futuristic holographic workspace companion device. The site utilizes a dark glassmorphic design system, vibrant gradients, and elegant scroll/hover interactions.

### Features
1. **Interactive Navigation Menu**:
   - **Fixed Position**: Remains at the top of the screen at all times on all pages.
   - **Scroll Transitions**: Header transitions from fully transparent to a glassmorphic blurred overlay (`backdrop-filter`) with adjusted height and border-bottom styling as you scroll past 50px.
   - **Hover Effects**: Links feature a custom sliding-underline animation (`transform: scaleX`).
   - **Scroll-Spy Interaction**: The navigation links automatically highlight based on which section (Home, Features, Showcase, Contact) is currently visible in the viewport.
   - **Responsive Hamburger Menu**: Collapses into a sliding right drawer on mobile screens (< 768px) with a sleek animated close trigger.
2. **Interactive Waitlist Form**: Includes real-time email validation, loading triggers, and feedback messages.
3. **Multi-page demonstration**: Includes an `about.html` page to show the persistence and seamless operation of the navigation header across multiple pages.

---

## 📂 File Structure
```text
PRODIGY_WD_01/
├── index.html        # Main Landing Page
├── about.html        # Auxiliary Page (Vision & Specs)
├── style.css         # Responsive CSS Styles & Custom Design System
├── script.js         # JavaScript Logic (Scroll events, Scroll Spy, Menu Drawer, Form Validation)
├── README.md         # Documentation
└── assets/
    └── images/
        └── aether_device.png  # AI-generated product mockup
```

---

## 🛠️ Technologies Used
- **HTML5**: Semantic markup structuring.
- **CSS3**: Variables, Flexbox, CSS Grid, media queries, CSS transitions, keyframe animations, and custom scrollbars.
- **JavaScript (ES6)**: DOM manipulation, scroll event listeners, IntersectionObserver/Scroll-Spy logic, and validation.
- **FontAwesome (CDN)**: Vector icons for visuals.
- **Google Fonts**: `Outfit` (for futuristic headings) and `Inter` (for readable body text).

---

## 🚀 How to Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/prannoydidymus/PRODIGY_WD_01.git
   ```
2. Navigate into the project folder:
   ```bash
   cd PRODIGY_WD_01
   ```
3. Open `index.html` in your favorite web browser (double click or open via live server extension).
