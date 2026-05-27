export type ISO8601String = string & { readonly __brand: unique symbol };
export type UUIDString = string & { readonly __brand: unique symbol };

export interface Booking {
  id: UUIDString;
  deskId: UUIDString;
  startTime: ISO8601String;
  endTime: ISO8601String;
  guestName: string;
  guestPhone: string;
}

export interface CreateBookingRequest {
  deskId: UUIDString;
  startTime: ISO8601String;
  endTime: ISO8601String; 
  guestName: string;
  guestPhone: string;
}