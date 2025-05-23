import React from 'react';

export interface WindowType {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  zIndex: number;
}
