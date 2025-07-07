# 🌍 EasyAI Itinerary

<div align="center">

![Travel Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=300&fit=crop&crop=center)

**AI-Powered Travel Planning Made Simple** ✈️

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[🚀 Live Demo](your-demo-link) | [📖 Documentation](your-docs-link) | [🐛 Report Bug](your-issues-link)

</div>

---

## 🎯 Overview

EasyAI Itinerary is a modern, AI-powered travel planning application that creates personalized travel itineraries based on your preferences. Simply describe your dream trip, and our AI will generate a comprehensive travel plan including accommodations, dining, activities, budget estimates, and more!

### ✨ Key Features

🤖 **AI-Powered Planning** - Generate detailed travel itineraries using advanced AI  
🌓 **Dark/Light Mode** - Beautiful themes that adapt to your preference  
📧 **Email Integration** - Send your travel plans directly to your inbox  
📱 **Responsive Design** - Perfect experience on all devices  
🎨 **Modern UI/UX** - Clean, intuitive interface with smooth animations  
⚡ **Real-time Validation** - Instant feedback with Zod validation  
🏷️ **Smart Categorization** - Organized sections for hotels, restaurants, budget, etc.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Declarative routing for React applications
- **Lucide React** - Beautiful, customizable icons

### **State Management**
- **Redux Toolkit** - Efficient Redux development with modern patterns
- **RTK Query** - Powerful data fetching and caching solution

### **Development Tools**
- **Vite** - Next-generation frontend build tool
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

### **Validation & API**
- **Zod** - TypeScript-first schema validation
- **Fetch API** - Modern HTTP client for API communications

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/easyai-itinerary.git
   cd easyai-itinerary
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_TRAVEL_API_URL=your_travel_api_url
   VITE_EMAIL_API_URL=your_email_api_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

---

## 🏗️ Project Structure

```
src/
├── 📁 app/                    # Redux store configuration
│   ├── store/
│   │   ├── store.ts          # Main store setup
│   │   └── hooks.ts          # Typed Redux hooks
│   └── App.tsx               # Root component
├── 📁 components/            # Reusable UI components
│   └── ui/
│       ├── ThemeToggle.tsx   # Dark/light mode toggle
│       └── Loaders.tsx       # Loading components
├── 📁 features/              # Feature-based modules
│   └── theme/
│       └── themeSlice.ts     # Theme state management
├── 📁 pages/                 # Page components
│   └── travel/
│       ├── TravelPlannerHome.tsx    # Main travel planner interface
│       └── TravelPlanDisplay.tsx    # Travel plan results
├── 📁 services/              # API services
│   └── api/
│       ├── travel/travelApi.ts      # Travel planning API
│       └── email/emailApi.ts        # Email service API
├── 📁 utils/                 # Utility functions
│   ├── constants/            # App constants
│   └── validation/           # Zod schemas
└── 📁 styles/                # Global styles
```

---

## 🎮 How It Works

### 1. **Planning Your Trip** 🗺️
- Enter your travel question or select from example prompts
- Describe your destination, duration, budget, and preferences
- Choose whether to receive the plan via email

### 2. **AI Generation** 🤖
- Our AI analyzes your requirements
- Generates comprehensive travel plans with multiple sections:
  - 📅 **Itinerary** - Day-by-day schedule
  - 🏨 **Hotels** - Accommodation recommendations
  - 🍽️ **Restaurants** - Dining suggestions
  - 💰 **Budget** - Cost breakdown
  - 🚗 **Transportation** - Travel options
  - 🎯 **Activities** - Things to do
  - 🌤️ **Weather** - Climate information

### 3. **Review & Customize** ✏️
- View your personalized travel plan
- Save plans for future reference
- Share with friends and family
- Create new variations

---

## 🎨 Features in Detail

### 🌓 Theme System
- **System Preference Detection** - Automatically adapts to your OS theme
- **Manual Toggle** - Switch between light and dark modes
- **Persistent Storage** - Remembers your preference across sessions
- **Smooth Transitions** - Beautiful animations between theme changes

### 📧 Email Integration
- **One-Click Sharing** - Send travel plans to your email instantly
- **Formatted Content** - Well-structured email with all plan details
- **Error Handling** - Graceful handling of email delivery issues

### 🔍 Smart Validation
- **Real-time Feedback** - Instant validation as you type
- **Travel-specific Rules** - Ensures queries are travel-related
- **Error Recovery** - Clear guidance on fixing validation issues

---

## 🔧 Configuration

### API Endpoints
Update the API constants in `src/utils/constants/api_constants.ts`:

```typescript
export class ApiConstants {
    static readonly TRAVEL_API_BASE_URL = "your-travel-api-url";
    static readonly TRAVEL_QUERY_ENDPOINT = "/query";
    static readonly SEND_EMAIL_ENDPOINT = "/send-email";
}
```

### Theme Customization
Modify theme colors in your Tailwind configuration or CSS variables.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Maintain accessibility standards

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |

---

## 🐛 Known Issues

- [ ] Large travel plans may take longer to load
- [ ] Email delivery depends on third-party service availability
- [ ] Some AI responses may require formatting improvements

---

## 🗺️ Roadmap

- [ ] **User Authentication** - Save and manage multiple travel plans
- [ ] **Social Sharing** - Share plans on social media
- [ ] **Offline Mode** - Cache plans for offline viewing
- [ ] **Multi-language Support** - Support for multiple languages
- [ ] **Advanced Filters** - More detailed travel preferences
- [ ] **Collaborative Planning** - Share and edit plans with others
- [ ] **Integration APIs** - Connect with booking platforms

---

## 🙏 Acknowledgments

- **OpenAI** for AI capabilities
- **Tailwind CSS** for the amazing styling framework
- **React Team** for the incredible library
- **Redux Toolkit** for state management made easy
- **Lucide** for beautiful icons

---

<div align="center">

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

⭐ **Star this repo if you found it helpful!** ⭐

[🔝 Back to Top](#-easyai-itinerary)

</div>
