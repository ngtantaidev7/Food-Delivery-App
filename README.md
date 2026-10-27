# Food-Delivery-App

Ứng dụng đặt đồ ăn trực tuyến (Food Delivery App) xây dựng bằng **React Native (Expo Router)** kết hợp Backend **Node.js/Express** và cơ sở dữ liệu **MongoDB (Mongoose ODM)**.

## 📱 Tech Stack
- **Client**: React Native, Expo Router, TypeScript, Zustand, TanStack Query, NativeWind
- **Backend**: Node.js, Express, TypeScript, Socket.io
- **Database**: MongoDB (Atlas) với GeoSpatial Indexing (`2dsphere`)
- **Features**: Real-time Order Tracking, In-app Chat & Voice Call, AI Recommendations & Visual AI

## 📂 Project Structure
```text
├── assets/
├── mobile/
│   ├── app/                # Expo Router (Tabs, Restaurant, Food, Checkout, Chat, Tracking)
│   ├── components/         # Common, Cards, Map, Chat UI Components
│   ├── stores/             # Zustand state management
│   ├── types/              # TypeScript definitions
│   ├── services/           # API and AI integrations
│   ├── hooks/              # Custom React hooks
│   └── constants/          # Colors and layout definitions
└── server/                 # Express backend & MongoDB Schemas
```
