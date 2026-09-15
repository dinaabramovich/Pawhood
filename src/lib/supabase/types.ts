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

export type DogSize = "small" | "medium" | "large";
export type DogGender = "male" | "female";
export type DogEnergyLevel = "low" | "medium" | "high";

export type DogsRow = {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  birth_date: string | null;
  size: DogSize | null;
  gender: DogGender | null;
  energy_level: DogEnergyLevel | null;
  bio: string | null;
  photo_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DogsInsert = {
  owner_id: string;
  name: string;
  breed?: string | null;
  birth_date?: string | null;
  size?: DogSize | null;
  gender?: DogGender | null;
  energy_level?: DogEnergyLevel | null;
  bio?: string | null;
  photo_urls?: string[];
};

export type DogsUpdate = Partial<DogsInsert>;

export type ParkAmenities = {
  fenced?: boolean;
  water?: boolean;
  lighting?: boolean;
};

export type ParksRow = {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  address: string | null;
  amenities: ParkAmenities;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
};

// Parks are seeded via SQL in this MVP, not created through the client, but
// GenericTable still requires Insert/Update shapes.
export type ParksInsert = {
  name: string;
  description?: string | null;
  address?: string | null;
  amenities?: ParkAmenities;
  photo_urls?: string[];
};

export type ParksUpdate = Partial<ParksInsert>;

export type ParkVisitsRow = {
  id: string;
  user_id: string;
  park_id: string;
  visit_time: string;
  created_at: string;
};

export type ParkVisitsInsert = {
  user_id: string;
  park_id: string;
  visit_time: string;
};

export type ParkVisitsUpdate = Partial<ParkVisitsInsert>;

export type VisitDogsRow = {
  visit_id: string;
  dog_id: string;
};

export type VisitDogsInsert = VisitDogsRow;
export type VisitDogsUpdate = Partial<VisitDogsInsert>;

// user_locations is never read back by the client in this app (the device
// always has a fresher GPS fix than anything we'd cache), so `location` is
// only ever written, as an EWKT string ("SRID=4326;POINT(lng lat)") that
// Postgres's geography input parser accepts over PostgREST.
export type UserLocationsRow = {
  user_id: string;
  location: string;
  accuracy_m: number | null;
  updated_at: string;
};

export type UserLocationsInsert = {
  user_id: string;
  location: string;
  accuracy_m?: number | null;
};

export type UserLocationsUpdate = Partial<UserLocationsInsert>;

export type NearbyDog = {
  dog_id: string;
  dog_name: string;
  dog_photo_url: string | null;
  owner_display_name: string;
  owner_avatar_url: string | null;
  distance_band: string;
};

export type ConversationsRow = {
  id: string;
  created_at: string;
  last_message_at: string;
};

// Conversations/participants are only ever written by the start_conversation
// RPC (a SECURITY DEFINER function), never inserted directly by the client,
// but GenericTable still requires Insert/Update shapes.
export type ConversationsInsert = Record<string, never>;
export type ConversationsUpdate = Record<string, never>;

export type ConversationParticipantsRow = {
  conversation_id: string;
  user_id: string;
};

export type ConversationParticipantsInsert = ConversationParticipantsRow;
export type ConversationParticipantsUpdate = Partial<ConversationParticipantsInsert>;

export type MessagesRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
  deleted_at: string | null;
};

export type MessagesInsert = {
  conversation_id: string;
  sender_id: string;
  body: string;
};

export type MessagesUpdate = Partial<MessagesInsert>;

export type ReportTargetType = "user" | "dog" | "message" | "park";

export type ReportsRow = {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
};

export type ReportsInsert = {
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  details?: string | null;
};

export type ReportsUpdate = Partial<ReportsInsert>;

export type BlockedUsersRow = {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
};

export type BlockedUsersInsert = {
  blocker_id: string;
  blocked_id: string;
};

export type BlockedUsersUpdate = Partial<BlockedUsersInsert>;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UsersRow;
        Insert: UsersInsert;
        Update: UsersUpdate;
        Relationships: [];
      };
      dogs: {
        Row: DogsRow;
        Insert: DogsInsert;
        Update: DogsUpdate;
        Relationships: [];
      };
      parks: {
        Row: ParksRow;
        Insert: ParksInsert;
        Update: ParksUpdate;
        Relationships: [];
      };
      park_visits: {
        Row: ParkVisitsRow;
        Insert: ParkVisitsInsert;
        Update: ParkVisitsUpdate;
        Relationships: [];
      };
      visit_dogs: {
        Row: VisitDogsRow;
        Insert: VisitDogsInsert;
        Update: VisitDogsUpdate;
        Relationships: [];
      };
      user_locations: {
        Row: UserLocationsRow;
        Insert: UserLocationsInsert;
        Update: UserLocationsUpdate;
        Relationships: [];
      };
      conversations: {
        Row: ConversationsRow;
        Insert: ConversationsInsert;
        Update: ConversationsUpdate;
        Relationships: [];
      };
      conversation_participants: {
        Row: ConversationParticipantsRow;
        Insert: ConversationParticipantsInsert;
        Update: ConversationParticipantsUpdate;
        Relationships: [];
      };
      messages: {
        Row: MessagesRow;
        Insert: MessagesInsert;
        Update: MessagesUpdate;
        Relationships: [];
      };
      reports: {
        Row: ReportsRow;
        Insert: ReportsInsert;
        Update: ReportsUpdate;
        Relationships: [];
      };
      blocked_users: {
        Row: BlockedUsersRow;
        Insert: BlockedUsersInsert;
        Update: BlockedUsersUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      nearby_dogs: {
        Args: {
          requester_lat: number;
          requester_lng: number;
          radius_meters?: number;
        };
        Returns: NearbyDog[];
      };
      start_conversation: {
        Args: { other_user_id: string };
        Returns: string;
      };
    };
  };
};
