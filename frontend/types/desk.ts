import type { UUIDString } from "./booking";

export type DeskArea = 'Open Space' | 'Quiet Zone' | 'Meeting Room' | 'Executive Suite';

export interface Desk {
  id: UUIDString & { readonly __deskId: unique symbol };
  name: string;
  area: DeskArea;
  pricePerHourCents: number; 
}