<div align="center">
  <img src="https://github.com/user-attachments/assets/ac47224c-df10-41b4-8890-3f54730b96be" alt="AjoSave Logo" width="120" height="120">
  
  # AjoSave
  
  ### Save Together, Grow Together
  
  A modern mobile-first savings platform that brings the power of traditional savings groups (Ajo) to your fingertips.
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo)](https://expo.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
  
  [Live Demo](https://ajosave-gby5ey6l9-otikanelsons-projects.vercel.app) • [Download APK](#) • [Report Bug](https://github.com/otikanelson/Ajosave/issues)
  
</div>

---

## 📱 Screenshots

<div align="center">
  <img src="https://github.com/user-attachments/assets/f6178035-4a92-4ca5-9de1-6d63374eea56" alt="Welcome Screen" width="200">
  <img src="https://github.com/user-attachments/assets/3289c817-cf06-49ef-8ec5-bd1b74f89708" alt="Login" width="200">
  <img src="https://github.com/user-attachments/assets/146f8456-f0bf-48f1-8f75-9c7b49004a33" alt="Dashboard" width="200">
  <img src="https://github.com/user-attachments/assets/df3a23fa-6379-41ee-a8b0-8a179ef9c04f" alt="Groups" width="200">
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/76dd4370-71b3-475d-8726-62f21cba8a36" alt="Payment" width="200">
  <img src="https://github.com/user-attachments/assets/da2d2548-6659-43e3-8626-466ba5771363" alt="Wallet" width="200">
  <img src="https://github.com/user-attachments/assets/4512b735-a334-4d14-840e-c400c20bea86" alt="Transactions" width="200">
</div>

---

## ✨ Features

### 💰 Savings Groups
- **Create Groups** - Start your own savings circle with custom rules
- **Join Groups** - Connect with existing savings communities
- **Rotation System** - Fair and transparent payout scheduling
- **Member Management** - Track contributions and payouts

### 💳 Wallet & Payments
- **Secure Wallet** - Manage your funds with ease
- **Paystack Integration** - Safe and reliable payment processing
- **Fund Locking** - Protect your savings from impulsive spending
- **Auto-Withdrawal** - Automatic transfers to your bank account
- **Transaction History** - Complete audit trail of all activities

### 🔐 Security & Trust
- **OTP Verification** - Phone number authentication
- **JWT Tokens** - Secure session management
- **Encrypted Payments** - PCI-compliant payment processing
- **MongoDB Atlas** - Enterprise-grade database security

### 📊 Management
- **Real-time Updates** - Live balance and transaction tracking
- **Notifications** - Stay informed about group activities
- **Analytics** - Track your savings progress
- **Export Data** - Download transaction history

---

## 🏗️ Tech Stack

### Mobile App
- **Framework:** React Native (Expo)
- **Navigation:** Expo Router
- **State Management:** React Context API
- **UI Components:** Custom components with React Native
- **Payments:** Paystack React Native SDK
- **Fonts:** Gilroy (Regular, Medium, SemiBold, Bold)

### Web App
- **Framework:** React + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB Atlas
- **Authentication:** JWT + OTP (Termii)
- **Payments:** Paystack API
- **Validation:** Express Validator
- **Security:** Helmet, CORS, Rate Limiting

### DevOps
- **Hosting:** Vercel (Frontend & Backend)
- **Mobile Builds:** EAS Build
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel Auto-Deploy

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- MongoDB Atlas account
- Expo CLI
- Android Studio (for Android builds)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/otikanelson/Ajosave.git
cd Ajosave
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start Backend Server**
```bash
npm start
```

5. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

6. **Start Web App**
```bash
npm run dev
```

7. **Install Mobile Dependencies**
```bash
cd ../mobile
npm install
```

8. **Start Mobile App**
```bash
npx expo start
```

---

## 📁 Project Structure

```
Ajosave/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Database & app configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── middlewares/ # Auth, validation, error handling
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API routes
│   │   └── services/    # Business logic & cron jobs
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite web app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API service layer
│   │   └── utils/       # Helper functions
│   └── index.html       # Entry HTML
│
└── mobile/              # React Native + Expo app
    ├── app/             # Expo Router screens
    │   ├── (auth)/     # Authentication screens
    │   ├── (tabs)/     # Tab navigation screens
    │   └── _layout.tsx # Root layout
    ├── components/      # Reusable components
    ├── contexts/        # Context providers
    ├── services/        # API services
    ├── constants/       # Colors, spacing, typography
    └── assets/          # Images, fonts, icons
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TERMII_API_KEY=your_termii_api_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

**Frontend (.env.local)**
```env
VITE_API_PRIMARY_URL=http://192.168.1.6:5000/api
VITE_API_FALLBACK_URL=https://ajosave-backend.vercel.app/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

**Mobile (.env)**
```env
EXPO_PUBLIC_API_URL=https://ajosave-backend.vercel.app/api
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

---

## 📱 Building for Production

### Web App
```bash
cd frontend
npm run build
```

### Mobile App (Android)
```bash
cd mobile
eas build --platform android --profile production
```

### Mobile App (iOS)
```bash
cd mobile
eas build --platform ios --profile production
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Otika Nelson**
- GitHub: [@otikanelson](https://github.com/otikanelson)
- Website: [ajosave-gby5ey6l9-otikanelsons-projects.vercel.app](https://ajosave-gby5ey6l9-otikanelsons-projects.vercel.app)

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - For the amazing React Native framework
- [Paystack](https://paystack.com/) - For secure payment processing
- [MongoDB](https://www.mongodb.com/) - For reliable database hosting
- [Vercel](https://vercel.com/) - For seamless deployment

---

<div align="center">
  
  ### ⭐ Star this repo if you find it helpful!
  
  Made with ❤️ in Nigeria
  
</div>
