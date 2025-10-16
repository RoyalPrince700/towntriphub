# TownTripHub

## Project Overview

TownTripHub is a comprehensive web-based platform designed to connect verified users with drivers and logistics personnel within The Gambia. The system supports both ride-booking services and goods delivery logistics, featuring user authentication, driver/logistics verification, trip/delivery booking and management, manual payment systems, and review features — all managed through secure dashboards for users, drivers, logistics personnel, and admin.

## Tech Stack

- **Frontend**: React + Vite + JSX
- **Backend**: Node.js + Express.js + MongoDB (MERN Stack)
- **Authentication**: JWT
- **File Uploads**: Cloudinary
- **Email Service**: Mailtrap
- **Payment System**: Manual payment system (cash/transfer to driver/logistics personnel)

## Features

### 1. Authentication & Verification
- Secure signup and login system + signup signin with Google for Users, Drivers, and Logistics Personnel
- Verification process (email or phone-based)
- Password reset and account management
- Profile creation and update features

### 2. Payment System
- Manual payment system (cash or bank transfer to driver/logistics personnel)
- Price display and payment instructions for users
- Payment confirmation system between users and service providers
- Basic admin view for payment tracking

### 3. User Dashboard
- Book rides and manage upcoming/past trips
- Book logistics services for goods delivery
- View trip/delivery history and status updates
- Edit profile and payment preferences
- Rate and review completed rides and deliveries

### 4. Driver & Logistics Personnel Dashboard
- Receive and manage ride requests and delivery jobs
- Accept or decline bookings and delivery requests
- View trip/delivery history and earnings overview
- Update vehicle and profile information
- Manage service availability and pricing

### 5. Admin/Management Section (Basic)
- View and manage all registered users, drivers, and logistics personnel
- Approve or suspend driver and logistics personnel accounts
- View trip, delivery, and payment summaries
- Access to system analytics overview (basic)

### 6. Trip & Delivery Booking & Management
- Real-time ride request and delivery booking system
- Pickup and destination input fields for rides and deliveries
- Package details input for logistics services
- Status updates for Pending, Accepted, Completed
- Dashboard synchronization for users, drivers, and logistics personnel

### 7. Ratings & Reviews
- Users can rate drivers and logistics personnel and leave feedback
- Display average ratings on driver and logistics personnel profiles

### 8. Website Pages
- Home Page
- About Us
- Contact Page
- FAQs Page
- Terms & Privacy Policy Page

## Project Structure

```
towntriphub/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── mailtrap/
│   │   ├── email.js
│   │   ├── emailtemplate.js
│   │   └── mailtrap.config.js
│   ├── utils/
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── context/
│   ├── public/
│   └── package.json
├── .env.template
├── README.md
└── todo.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd towntriphub
```

2. Set up backend
```bash
cd backend
npm install
cp ../.env.template .env
# Configure your environment variables
npm start
```

3. Set up frontend
```bash
cd ../frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/towntriphub
JWT_SECRET=your_jwt_secret_key
MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_ENDPOINT=your_mailtrap_endpoint
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
