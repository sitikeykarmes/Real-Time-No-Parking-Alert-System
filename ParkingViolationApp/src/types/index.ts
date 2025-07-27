export interface Location {
  id: string;
  name: string;
  description?: string;
  video_source?: string;
  status: "active" | "inactive";
  is_monitoring: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Violation {
  id: number;
  location_id: string;
  vehicle_id?: number;
  detected_at?: string;
  duration_seconds?: number;
  confidence_score?: number;
  image_path?: string;
  video_path?: string;
  status: "active" | "acknowledged";
  acknowledged_at?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
