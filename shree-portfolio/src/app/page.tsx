'use client';

import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <PortfolioLayout>
      <ChatInterface />
    </PortfolioLayout>
  );
}