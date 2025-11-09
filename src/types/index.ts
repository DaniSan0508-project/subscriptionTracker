export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  service_id: number;
  price: string;
  renewal_date: string;
  notification_date: string;
  service: Service;
}