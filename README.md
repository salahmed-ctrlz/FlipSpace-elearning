# FlipSpace - Modern Flipped Learning Platform

A beautiful, accessible, and feature-rich flipped classroom platform built with React, TypeScript, and Tailwind CSS.

![FlipSpace](https://lovable.dev/opengraph-image-p98pqg.png)

## 🎓 About FlipSpace

FlipSpace is a modern educational platform that implements the flipped classroom methodology, where students engage with learning materials outside of class and use class time for active learning, discussions, and collaborative problem-solving.

## ✨ Features

### For Teachers
- **Resource Management**: Upload and organize course materials (videos, PDFs, links)
- **Analytics Dashboard**: Monitor student engagement, views, and completion rates
- **Discussion Moderation**: Engage with students and answer questions
- **Progress Tracking**: View detailed metrics on resource usage

### For Students
- **Resource Library**: Access organized course materials by module/week
- **Interactive Assessments**: Take auto-graded quizzes with instant feedback
- **Discussion Forum**: Ask questions, collaborate with peers, and get teacher support
- **Progress Tracking**: Mark resources as complete and track your learning journey

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd flipspace

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🔐 Demo Credentials

### Teacher Account
- **Username**: `teacher1` (Pr. Khalki Smaine)
- **Password**: `teachpass`

### Student Account
- **Username**: `student1` (Hamoudi Benarba)
- **Password**: `studpass`

## 🏗️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: LocalStorage (demo)

## 🎨 Design System

FlipSpace uses a carefully crafted design system with:
- **Colors**: Soft beige backgrounds (#F8F5F0), academic blue (#004E89), gold accents (#B8860B)
- **Typography**: Playfair Display (serif headings) + Inter (sans-serif body)
- **Spacing**: Generous vertical spacing with max-width of 1100px
- **Accessibility**: WCAG AA compliant, keyboard navigation, reduced motion support

## 📁 Project Structure

```
src/
├── assets/          # Static assets (logo, images)
├── components/      # Reusable UI components
│   ├── ui/         # shadcn/ui components
│   ├── Navbar.tsx
│   ├── LoginForm.tsx
│   ├── ResourceCard.tsx
│   ├── QuizPlayer.tsx
│   └── ...
├── contexts/       # React Context providers
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── data/           # JSON seed data
│   ├── users.json
│   ├── resources.json
│   ├── quizzes.json
│   └── discussions.json
├── pages/          # Route pages
│   ├── Dashboard.tsx
│   ├── Resources.tsx
│   ├── Forum.tsx
│   ├── Assessments.tsx
│   ├── Analytics.tsx
│   └── Help.tsx
├── utils/          # Utility functions
│   ├── storage.ts
│   └── api-mock.ts
└── App.tsx         # Main app component
```

## 🔧 Key Features Explained

### Authentication
- Simple username/password authentication
- Role-based access (teacher/student)
- Session persistence via localStorage

### Resources
- Support for videos (YouTube embeds), PDFs, and external links
- View tracking and completion marking
- Module/week organization

### Assessments
- Multiple-choice quizzes with auto-grading
- Instant feedback with explanations
- Unlimited retakes with best score tracking

### Discussion Forum
- Threaded discussions per resource
- Reply functionality
- Teacher/student badges
- Real-time updates

### Analytics (Teachers Only)
- Resource engagement metrics
- View and completion statistics
- Visual charts and trends
- Student performance insights

## ♿ Accessibility

FlipSpace is built with accessibility in mind:
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Visible focus indicators
- Color contrast compliance (WCAG AA)
- Reduced motion support

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly interface

## 🎯 Future Enhancements

- Real backend integration (Supabase)
- Real-time notifications
- File upload functionality
- Advanced analytics
- Calendar integration
- Mobile app (React Native)

## 📄 License

This project is built for educational purposes.

## 🤝 Contributing

This is a demo project. For production use, consider:
1. Integrating a real backend (e.g., Supabase)
2. Implementing proper authentication (JWT, OAuth)
3. Adding file upload capabilities
4. Implementing real-time features (WebSockets)
5. Adding more assessment types

## 📞 Support

For questions or issues, please refer to the Help page within the application or contact your course instructor.

---

Built with ❤️ using [Lovable](https://lovable.dev)
