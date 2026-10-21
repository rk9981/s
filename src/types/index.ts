export type FontTheme = 'rainbow' | 'candy' | 'sunset' | 'neon' | 'cyber';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  savedFavorites: string[];
  recentTools: string[];
}

export type ToolCategory = 'all' | 'pdf-docs' | 'media' | 'image' | 'text-code' | 'utilities';

export interface ToolMeta {
  id: string;
  title: string;
  shortDesc: string;
  category: ToolCategory;
  badge?: string;
  badgeColor?: string;
  iconName: string;
  gradient: string;
  textColor: string;
  popular?: boolean;
}
