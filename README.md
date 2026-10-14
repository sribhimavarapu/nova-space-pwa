# 🚀 Nova Space - 3D Virtual Collaboration Platform

> **Better than Gather.town** - A fully immersive 3D virtual space for remote teams, built with React, Three.js, and modern web technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.7-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186.1-green)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)

![Nova Space Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Nova+Space+-+3D+Virtual+Collaboration)

## ✨ Features

### 🎮 **Immersive 3D Experience**
- **Full 3D movement** - Navigate with WASD keys in true 3D space
- **Camera controls** - Orbit, zoom, and explore from any angle
- **Floating avatars** - Beautiful 3D spheres with emoji faces
- **Spatial awareness** - See exactly where everyone is in the room

### 👥 **Social Features**
- **Proximity video** - Video feeds scale based on distance
- **Gesture system** - Wave, clap, and dance animations
- **Status indicators** - Active, away, speaking states
- **Quick reactions** - Send emoji reactions instantly
- **Real-time chat** - Text chat with timestamps

### 🏢 **Interactive Environment**
- **Conference room** - Professional meeting space
- **Whiteboards** - Clickable collaboration boards
- **Main screen** - Screen sharing in 3D
- **Breakout zones** - Private conversation areas
- **Atmospheric particles** - Immersive ambiance

### 🔐 **Space Management**
- **Public/Private spaces** - Control who can join
- **Role-based access** - Owner, Admin, Member, Guest roles
- **Join approval** - Approve requests for private spaces
- **Share easily** - Link, email, or QR code
- **3-space limit** - Prevents spam and abuse

### 🎨 **Premium Design**
- **Glassmorphism UI** - Modern, translucent interfaces
- **Purple-pink gradient** - Consistent brand colors
- **Smooth animations** - 60 FPS performance
- **Responsive** - Works on desktop and tablet
- **Dark theme** - Easy on the eyes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nova-space-pwa.git
cd nova-space-pwa

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Use

### Creating a Space
1. Navigate to `/home`
2. Click "Create New Space"
3. Choose a template (Meeting, Gaming, Study, Creative)
4. Set privacy (Public or Private)
5. Add name and description
6. Click "Create Space"

### Joining a Space
1. Go to `/join` or click "Join a Space"
2. Enter invite code or browse available spaces
3. Click "Join Space" (or "Request to Join" for private)
4. Start collaborating!

### Moving in 3D Space
- **W** or **↑** - Move forward
- **S** or **↓** - Move backward
- **A** or **←** - Move left
- **D** or **→** - Move right
- **Mouse drag** - Rotate camera
- **Scroll** - Zoom in/out

### Gestures
- **Press 1** - Wave gesture
- **Press 2** - Clap gesture
- **Press 3** - Dance gesture
- **Click avatar** - Send reaction

## 📁 Project Structure

```
nova-space-pwa/
├── src/
│   ├── components/
│   │   ├── 3d/                    # 3D scene components
│   │   │   ├── Scene3D.tsx        # Base 3D canvas
│   │   │   ├── Avatar3D.tsx       # Avatar rendering
│   │   │   ├── SimpleImmersiveRoom.tsx  # Main 3D room
│   │   │   └── index.ts
│   │   ├── ui/                    # UI components (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── ShareSpaceModal.tsx    # Share dialog
│   ├── pages/
│   │   ├── StartupPage.tsx        # Landing page
│   │   ├── HomePage.tsx           # Dashboard
│   │   ├── SpaceCreationPage.tsx  # Create space flow
│   │   ├── JoinSpacePage.tsx      # Browse/join spaces
│   │   └── EnhancedRoomPage.tsx   # 3D meeting room
│   ├── services/
│   │   └── spaceService.ts        # Space management logic
│   ├── styles/
│   │   └── global.css             # Global styles + Tailwind
│   ├── App.tsx                    # Router config
│   └── main.tsx                   # Entry point
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── README.md                      # This file
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.7
- **3D Engine**: Three.js 0.186.1
- **3D React Integration**: React Three Fiber 9.8.1
- **3D Helpers**: @react-three/drei 10.7.9
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4.14
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router 7.17
- **Icons**: Lucide React 1.17
- **PWA**: vite-plugin-pwa 0.20

## 🌟 Key Features vs Gather.town

| Feature | Gather.town | Nova Space |
|---------|-------------|------------|
| **3D Movement** | 2D top-down only | ✅ Full 3D with camera orbit |
| **Proximity Video** | Fixed size | ✅ Scales with distance |
| **Gestures** | Limited | ✅ Wave, clap, dance |
| **Interactive Objects** | Basic | ✅ Whiteboards, screens, zones |
| **UI Design** | Basic | ✅ Glassmorphism, modern |
| **Avatar Customization** | Sprites | ✅ 3D spheres with emojis |
| **Open Source** | ❌ Closed | ✅ Fully customizable |
| **Performance** | Variable | ✅ 60 FPS optimized |
| **Space Management** | Basic | ✅ Roles, limits, approvals |
| **Share Options** | Link only | ✅ Link, email, QR code |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Gather.town](https://gather.town)
- Built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and Three.js**

🚀 **[Live Demo](#)** | 📚 **[Documentation](FEATURES.md)** | 🐛 **[Report Bug](issues)** | ✨ **[Request Feature](issues)**
