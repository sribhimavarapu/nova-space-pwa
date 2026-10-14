// Common Types and Interfaces for Nova Space PWA

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface SpaceDestination {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  distance?: string;
  duration?: string;
  price?: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
