# 🌱 Plantypheno - Plant Phenotyping Mobile App

A smart mobile application that helps users monitor and analyze plant health using AI-powered digital twin technology. Built with React Native and Expo, this app provides an intuitive interface for plant care management and health monitoring.

## ✨ Features

- **Plant Health Monitoring**: Track and analyze plant health through AI-powered image analysis
- **Digital Twin Technology**: Create and maintain digital replicas of your plants
- **Smart Notifications**: Get timely reminders for plant care
- **Plant Care Guide**: Access comprehensive care instructions and tips
- **Plant History**: View detailed history and growth progress
- **Multi-Plant Management**: Manage multiple plants and farms efficiently
- **User Profile**: Customize your profile and preferences
- **Dark Mode Support**: Comfortable viewing in any lighting condition

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- ngrok (for API tunneling)
- Docker and Docker Compose (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Digital-Twin-Mobile-App/FE.git
cd FE
```

2. Install dependencies:
```bash
cd my-app
npm install --legacy-peer-deps
```

3. Start the backend services:
```bash
# Start Backend service
cd ../BE
docker-compose up -d --build

# Start AI service
cd ../AI
docker-compose up -d
```

4. Set up ngrok for API tunneling:
```bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# Start ngrok tunnel
ngrok http 8082
```

5. Update API URLs:
- Open the project in your code editor
- Press `CTRL + Shift + F` to search for API_URL
- Replace the existing API URLs with your ngrok URL

6. Start the application:
```bash
npx expo start --go
```

## 📱 App Structure

- `/app` - Main application screens and navigation
- `/components` - Reusable UI components
- `/services` - API and backend service integrations
- `/assets` - Images, fonts, and other static assets
- `/context` - React Context providers
- `/utils` - Utility functions and helpers

## 🔧 Technical Stack

- React Native
- Expo
- TypeScript
- NativeWind (TailwindCSS for React Native)
- React Navigation
- Axios for API calls
- AsyncStorage for local storage
- React Native Reanimated for animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please contact one of the authors or open an issue in the repository.
