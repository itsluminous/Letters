/**
 * Database type definitions for the Letters
 * These types match the Supabase database schema
 */

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      letters: {
        Row: {
          id: string;
          author_id: string;
          recipient_id: string;
          content: string;
          created_at: string;
          updated_at: string;
          is_read: boolean;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          author_id: string;
          recipient_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
          is_read?: boolean;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          author_id?: string;
          recipient_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
          is_read?: boolean;
          read_at?: string | null;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          contact_user_id: string;
          display_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_user_id: string;
          display_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_user_id?: string;
          display_name?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Application-level types with parsed dates
export interface User {
  id: string;
  email: string;
  lastLoginAt: Date | null;
}

export interface Letter {
  id: string;
  authorId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  readAt: Date | null;
  author?: User;
  recipient?: User;
}

export interface Contact {
  id: string;
  userId: string;
  contactUserId: string;
  displayName: string;
  createdAt: Date;
  user?: User;
}

export interface LetterFilters {
  contactIds: string[];
  beforeDate: Date | null;
  afterDate: Date | null;
}
