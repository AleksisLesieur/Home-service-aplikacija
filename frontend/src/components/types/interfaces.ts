import { RefObject } from 'react';

export interface ServiceIconData {
  source: string;
  text: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceIcons: ServiceIconData[];
}

export interface Business {
  source?: string;
  alt?: string;
  title?: string;
  name?: string;
  address?: string;
  btnText?: string;
}

export interface BusinessCardProps extends Business {
  service?: string;
}

export interface ServiceIconProps {
  source: string;
  text: string;
  onClick: () => void;
}

export interface ServiceIconData {
  source: string;
  text: string;
}

export interface Category {
  _id: string;
  source: string;
  text: string;
}

export interface Appointment {
  _id: string;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  category?: string; // Add this field if it's not already in your appointment data
}

export interface User {
  _id: string;
  name: string;
  email: string;
  appointments: Appointment[];
}

export interface Category {
  source: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface UseOutsideClickResult<T extends HTMLElement> {
  ref: RefObject<T>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
