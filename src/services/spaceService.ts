// Space Management Service with LocalStorage

export interface Space {
  id: string;
  name: string;
  description: string;
  template: string;
  privacy: 'public' | 'private';
  maxMembers: number;
  ownerId: string;
  ownerName: string;
  members: SpaceMember[];
  pendingRequests: PendingRequest[];
  inviteCode: string;
  createdAt: string;
  lastActive: string;
}

export interface SpaceMember {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  avatar: Avatar;
  status: 'active' | 'away' | 'offline';
  isSpeaking?: boolean;
  position?: { x: number; y: number; z: number };
}

export interface PendingRequest {
  userId: string;
  userName: string;
  requestedAt: string;
}

export interface Avatar {
  style: string;
  color: string;
  name: string;
  emoji: string;
}

const STORAGE_KEYS = {
  SPACES: 'nova_spaces',
  USER: 'nova_user',
  MY_SPACES: 'nova_my_spaces',
};

// Avenger avatar presets
export const AVATAR_PRESETS: Avatar[] = [
  { name: 'Iron Man', emoji: '🦾', color: '#DC2626', style: 'tech' },
  { name: 'Captain America', emoji: '🛡️', color: '#2563EB', style: 'hero' },
  { name: 'Thor', emoji: '⚡', color: '#7C3AED', style: 'warrior' },
  { name: 'Hulk', emoji: '💚', color: '#16A34A', style: 'strong' },
  { name: 'Black Widow', emoji: '🕷️', color: '#DC2626', style: 'stealth' },
  { name: 'Hawkeye', emoji: '🏹', color: '#7C2D12', style: 'archer' },
  { name: 'Spider-Man', emoji: '🕸️', color: '#DC2626', style: 'agile' },
  { name: 'Black Panther', emoji: '🐾', color: '#1F2937', style: 'royal' },
  { name: 'Doctor Strange', emoji: '🔮', color: '#7C3AED', style: 'mystic' },
  { name: 'Scarlet Witch', emoji: '✨', color: '#DC2626', style: 'magic' },
];

class SpaceService {
  private generateId(): string {
    return `space_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  getCurrentUser(): SpaceMember {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) return JSON.parse(stored);
    
    // Default user
    const defaultUser: SpaceMember = {
      id: 'user_' + Date.now(),
      name: 'Guest User',
      role: 'member',
      avatar: AVATAR_PRESETS[0],
      status: 'active',
    };
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  setCurrentUser(user: SpaceMember): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUserSpaceCount(): number {
    const mySpaces = localStorage.getItem(STORAGE_KEYS.MY_SPACES);
    return mySpaces ? JSON.parse(mySpaces).length : 0;
  }

  canCreateSpace(): { allowed: boolean; reason?: string } {
    const count = this.getUserSpaceCount();
    if (count >= 3) {
      return { allowed: false, reason: 'Maximum 3 spaces allowed per user' };
    }
    return { allowed: true };
  }

  createSpace(spaceData: Omit<Space, 'id' | 'ownerId' | 'ownerName' | 'members' | 'pendingRequests' | 'inviteCode' | 'createdAt' | 'lastActive'>): Space {
    const user = this.getCurrentUser();
    const newSpace: Space = {
      ...spaceData,
      id: this.generateId(),
      ownerId: user.id,
      ownerName: user.name,
      members: [{ ...user, role: 'owner' }],
      pendingRequests: [],
      inviteCode: this.generateInviteCode(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Save to all spaces
    const spaces = this.getAllSpaces();
    spaces.push(newSpace);
    localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));

    // Add to my spaces
    const mySpaces = this.getMySpaces();
    mySpaces.push(newSpace.id);
    localStorage.setItem(STORAGE_KEYS.MY_SPACES, JSON.stringify(mySpaces));

    return newSpace;
  }

  getAllSpaces(): Space[] {
    const stored = localStorage.getItem(STORAGE_KEYS.SPACES);
    return stored ? JSON.parse(stored) : this.getInitialSpaces();
  }

  getMySpaces(): string[] {
    const stored = localStorage.getItem(STORAGE_KEYS.MY_SPACES);
    return stored ? JSON.parse(stored) : [];
  }

  getSpaceById(id: string): Space | null {
    const spaces = this.getAllSpaces();
    return spaces.find(s => s.id === id) || null;
  }

  getSpaceByInviteCode(code: string): Space | null {
    const spaces = this.getAllSpaces();
    return spaces.find(s => s.inviteCode === code) || null;
  }

  joinSpace(spaceId: string): { success: boolean; message: string; needsApproval?: boolean } {
    const space = this.getSpaceById(spaceId);
    if (!space) return { success: false, message: 'Space not found' };

    const user = this.getCurrentUser();
    const isMember = space.members.some(m => m.id === user.id);
    if (isMember) return { success: false, message: 'Already a member' };

    if (space.members.length >= space.maxMembers) {
      return { success: false, message: 'Space is full' };
    }

    if (space.privacy === 'private') {
      // Add to pending requests
      const alreadyRequested = space.pendingRequests.some(r => r.userId === user.id);
      if (alreadyRequested) {
        return { success: false, message: 'Request already pending' };
      }
      
      space.pendingRequests.push({
        userId: user.id,
        userName: user.name,
        requestedAt: new Date().toISOString(),
      });
      this.updateSpace(space);
      return { success: true, message: 'Join request sent', needsApproval: true };
    }

    // Public space - join directly
    space.members.push({ ...user, role: 'member' });
    space.lastActive = new Date().toISOString();
    this.updateSpace(space);

    // Add to my spaces
    const mySpaces = this.getMySpaces();
    if (!mySpaces.includes(spaceId)) {
      mySpaces.push(spaceId);
      localStorage.setItem(STORAGE_KEYS.MY_SPACES, JSON.stringify(mySpaces));
    }

    return { success: true, message: 'Joined successfully' };
  }

  approveJoinRequest(spaceId: string, userId: string): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space) return false;

    const requestIndex = space.pendingRequests.findIndex(r => r.userId === userId);
    if (requestIndex === -1) return false;

    const request = space.pendingRequests[requestIndex];
    space.pendingRequests.splice(requestIndex, 1);

    // Add as member (simplified - in real app would fetch full user data)
    space.members.push({
      id: userId,
      name: request.userName,
      role: 'member',
      avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      status: 'active',
    });

    this.updateSpace(space);
    return true;
  }

  updateSpace(space: Space): void {
    const spaces = this.getAllSpaces();
    const index = spaces.findIndex(s => s.id === space.id);
    if (index !== -1) {
      spaces[index] = space;
      localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
    }
  }

  deleteSpace(spaceId: string): boolean {
    const user = this.getCurrentUser();
    const space = this.getSpaceById(spaceId);
    if (!space || space.ownerId !== user.id) return false;

    // Remove from all spaces
    const spaces = this.getAllSpaces().filter(s => s.id !== spaceId);
    localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));

    // Remove from my spaces
    const mySpaces = this.getMySpaces().filter(id => id !== spaceId);
    localStorage.setItem(STORAGE_KEYS.MY_SPACES, JSON.stringify(mySpaces));

    return true;
  }

  leaveSpace(spaceId: string): boolean {
    const user = this.getCurrentUser();
    const space = this.getSpaceById(spaceId);
    if (!space) return false;

    // Can't leave if owner
    if (space.ownerId === user.id) return false;

    space.members = space.members.filter(m => m.id !== user.id);
    this.updateSpace(space);

    // Remove from my spaces
    const mySpaces = this.getMySpaces().filter(id => id !== spaceId);
    localStorage.setItem(STORAGE_KEYS.MY_SPACES, JSON.stringify(mySpaces));

    return true;
  }

  getInviteLink(spaceId: string): string {
    const space = this.getSpaceById(spaceId);
    if (!space) return '';
    return `${window.location.origin}/join/${space.inviteCode}`;
  }

  private getInitialSpaces(): Space[] {
    // Demo spaces with Avenger avatars
    return [
      {
        id: 'demo_1',
        name: 'Avengers HQ',
        description: 'Earth\'s Mightiest Heroes gathering space',
        template: 'meeting',
        privacy: 'public',
        maxMembers: 20,
        ownerId: 'demo_user_1',
        ownerName: 'Nick Fury',
        inviteCode: 'AVENGERS',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastActive: new Date().toISOString(),
        members: [
          { id: 'demo_user_1', name: 'Nick Fury', role: 'owner', avatar: { name: 'Iron Man', emoji: '🦾', color: '#DC2626', style: 'tech' }, status: 'active', isSpeaking: false },
          { id: 'demo_user_2', name: 'Tony Stark', role: 'admin', avatar: { name: 'Iron Man', emoji: '🦾', color: '#DC2626', style: 'tech' }, status: 'active', isSpeaking: true },
          { id: 'demo_user_3', name: 'Steve Rogers', role: 'member', avatar: { name: 'Captain America', emoji: '🛡️', color: '#2563EB', style: 'hero' }, status: 'active', isSpeaking: false },
          { id: 'demo_user_4', name: 'Bruce Banner', role: 'member', avatar: { name: 'Hulk', emoji: '💚', color: '#16A34A', style: 'strong' }, status: 'away', isSpeaking: false },
        ],
        pendingRequests: [],
      },
      {
        id: 'demo_2',
        name: 'Wakanda Council',
        description: 'Strategic planning and innovation hub',
        template: 'creative',
        privacy: 'private',
        maxMembers: 15,
        ownerId: 'demo_user_5',
        ownerName: 'T\'Challa',
        inviteCode: 'WAKANDA',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        members: [
          { id: 'demo_user_5', name: 'T\'Challa', role: 'owner', avatar: { name: 'Black Panther', emoji: '🐾', color: '#1F2937', style: 'royal' }, status: 'active', isSpeaking: false },
          { id: 'demo_user_6', name: 'Shuri', role: 'admin', avatar: { name: 'Scarlet Witch', emoji: '✨', color: '#DC2626', style: 'magic' }, status: 'active', isSpeaking: false },
        ],
        pendingRequests: [],
      },
    ];
  }
}

export const spaceService = new SpaceService();
