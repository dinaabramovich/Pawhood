// Hand-written until the schema is live and types are generated with:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type UsersRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  birth_year: number | null;
  city: string;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
};

export type UsersInsert = {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  birth_year?: number | null;
  city?: string;
};

export type UsersUpdate = Partial<UsersInsert>;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UsersRow;
        Insert: UsersInsert;
        Update: UsersUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
