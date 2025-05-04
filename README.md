# NextGen AI Fitness Coach 🏋️‍♂️

A revolutionary AI-powered fitness coaching platform that combines the power of Convex, Vapi, and Google's Gemini to provide personalized fitness guidance and workout programs.

![NextGen AI Fitness Coach](public/og.png)

## 🌟 Features

- **AI-Powered Workout Generation**: Create personalized workout programs using Google's Gemini AI
- **Voice Interaction**: Natural conversation with your AI fitness coach using Vapi
- **Real-time Data Sync**: Seamless data management with Convex backend
- **User Authentication**: Secure login and profile management with Clerk
- **Responsive Design**: Beautiful UI built with Next.js and Tailwind CSS
- **Dark Mode Support**: Eye-friendly interface with dark mode support

## 📹 Project Demo

Check out the project demo video on LinkedIn:
[NextGen AI Fitness Coach Demo](https://www.linkedin.com/posts/shivam-verma1-_nextjs-tailwindcss-shadcnui-activity-7324330274962444289-IVQV?utm_source=share&utm_medium=member_desktop&rcm=ACoAADOQ4akBNBBSuRIpdVpjjXtvdKaakqh8KJ0)

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex
- **AI**: Google Gemini, Vapi
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Convex

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Convex account
- Google Gemini API key
- Vapi API key
- Clerk account

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NextGen-FitCoach.git
cd NextGen-FitCoach
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up Convex:
```bash
# Install Convex CLI globally
npm install -g convex

# Login to Convex
npx convex dev

# Deploy your Convex backend
npx convex deploy
```

4. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
VAPI_API_KEY=your_vapi_api_key
```

5. Start the development server:
```bash
# Start Next.js development server
npm run dev
# or
yarn dev

# In a separate terminal, start Convex development server
npx convex dev
```

## 🎯 Usage

1. **Sign Up/Login**
   - Create an account or log in using the authentication system
   - Complete your profile with fitness goals and preferences

2. **Generate Workout Program**
   - Navigate to the Generate Program section
   - Input your fitness goals, preferences, and constraints
   - Let the AI create a personalized workout plan

3. **Interact with AI Coach**
   - Use voice commands to interact with your AI fitness coach
   - Get real-time feedback and adjustments to your workout
   - Ask questions about exercises and form

4. **Track Progress**
   - Monitor your workout history
   - View progress statistics
   - Get AI-powered insights and recommendations

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Vapi for voice interaction
- Convex for backend services
- Clerk for authentication
- The open-source community for amazing tools and libraries

## 📞 Support

For support, email [your-email@example.com] or open an issue in the repository.

---

Made with ❤️ by [Your Name]
