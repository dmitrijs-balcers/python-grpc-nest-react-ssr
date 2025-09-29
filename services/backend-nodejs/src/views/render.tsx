import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';

interface User {
  id: number;
  name: string;
  surname?: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}

interface RenderOptions {
  users: User[];
  totalCount: number;
  error: string | null;
}

export function renderApp(options: RenderOptions): string {
  const html = renderToString(<App {...options} />);
  return `<!DOCTYPE html>${html}`;
}
