export type CommissionStatus =
  | "new"
  | "reviewing"
  | "accepted"
  | "declined"
  | "completed";

export type CommissionRequest = {
  id: string;
  name: string;
  contact: string;
  artwork_type: string;
  description: string;
  budget: string | null;
  reference_path: string | null;
  status: CommissionStatus;
  created_at: string;
  updated_at: string;
};
