import { AddonProps } from "@/types/billing";

export interface FeedbackApiItem {
  id: number;
  event_name: string;
  customer_name: string | null;
  booking_date: string;
  feedback_date: string;
  feedback_status: string;
  booking_date_detail: string;
  booking_address: string;
  feedback_detail: string;
  ceremony_time: string;
  package_name: string;
  add_ons: AddonProps[];
}

export interface MappedFeedbackItem {
  id: string;
  eventName: string;
  client: string;
  bookingDate: string;
  feedbackDate: string;
  status: string;
}

export interface FeedbackDetailResponse {
  status: boolean;
  message: string;
  data: FeedbackApiItem;
}

export interface MarkAsPostedResponse {
  status: boolean;
  message: string;
}

export interface FeedbackApiResponse {
  status: boolean;
  message: string;
  data: {
    data: FeedbackApiItem[];
    links: {
      previous: string;
      next: string;
    };
    meta: {
      current_page: number;
      per_page: number;
      last_page: number;
      total: number;
    };
  };
}