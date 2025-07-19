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
  event_name: string;
  customer_name: string;
  booking_date: string;
  feedback_date: string;
  feedback_status: string;
  feedback_detail: string;
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

export interface PostedFeedback {
  id: number;
  event_name: string;
  customer_name: string;
  booking_date: string;
  ceremony_time?: string;
  package_name?: string;
  add_ons?: Array<{
    id: number;
    add_on_name: string;
    add_on_details: string;
    add_on_price: string;
  }>;
  feedback_date: string;
  feedback_status: string;
  feedback_detail: string;
}