# ParkEase - Smart Parking Finder

A comprehensive web application for finding and reserving parking spots around **Qassim University - College of Computer**.

## 🌟 Features

- **Interactive Map** - View all parking lots around Qassim University on an interactive map
- **Real-time Availability** - See available parking spots with color-coded markers
- **Search & Filter** - Find parking by name, location, price, and amenities
- **Lot Details** - View photos, prices, ratings, reviews, and amenities
- **Smart Booking** - 4-step booking wizard (Time → Vehicle → Review → Payment)
- **QR Code Access** - Generate QR codes for parking entry
- **Booking History** - Track upcoming, past, and cancelled bookings
- **User Profile** - Manage vehicles, payment methods, and saved lots
- **Dark/Light Mode** - Toggle between dark and light themes
- **Animations** - Smooth transitions and micro-interactions
- **Desktop Optimized** - Full desktop experience with responsive design

## 🚀 Live Demo

Deployed on Vercel: [ParkEase App](https://parkease3.vercel.app)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Leaflet** | Interactive maps |
| **Zustand** | State management |
| **Framer Motion** | Animations |
| **React Query** | Server state caching |
| **next-themes** | Dark/Light mode |
| **Lucide React** | Icons |
| **React QR Code** | QR code generation |
| **React Hot Toast** | Toast notifications |

## 📋 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **HomeMap** | Main map view with parking lot markers |
| `/search?q=` | **Search** | Search and filter parking results |
| `/lot/[id]` | **Lot Detail** | Full parking lot details with slot grid |
| `/booking/[lotId]` | **Booking Flow** | 4-step booking wizard |
| `/confirmation/[bookingId]` | **Confirmation** | QR code and booking summary |
| `/bookings` | **Booking History** | Upcoming, past, cancelled bookings |
| `/profile` | **Profile** | User settings and management |

## 🗺️ Parking Locations

All parking data is focused on **Qassim University - College of Computer**:
- College of Computer Parking A & B
- Faculty & Staff Parking
- Student Parking Zones 1 & 2
- VIP Parking
- Library Parking
- Engineering College Overflow Parking

## 🏗️ Build Order

1. Types & Interfaces
2. Mock Data (Qassim University focus)
3. Zustand Stores (auth, map, booking, user)
4. UI Components (Button, Card, Badge, etc.)
5. Map Components (ParkingMap, LotPin, LotBottomSheet)
6. Booking Components (SlotGrid, DateTimePicker, etc.)
7. All Pages (Home, Search, Lot Detail, Booking, etc.)
8. Dark/Light Mode
9. Animations & Micro-interactions

## 🚦 Running Locally

```bash
# Clone the repo
git clone https://github.com/mishari-9/parkease3.git
cd parkease3

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🧪 HCI Principles Implemented

- **Visibility of system status**: Loading indicators, progress bars, toasts
- **Match real world**: Pin colors match real signage (green/red/yellow)
- **User control & freedom**: Back buttons everywhere, cancel booking option
- **Consistency & standards**: Uniform components, consistent badges
- **Error prevention**: Disabled buttons until valid, form validation
- **Recognition over recall**: Saved lots, recent searches, default vehicle
- **Flexibility & efficiency**: Quick durations, rebook button
- **Aesthetic & minimalist**: Clean design, focused information
- **Help users with errors**: Toast messages, empty states with actions

## 📄 License

HCI Course Project IT215 · Group G4
