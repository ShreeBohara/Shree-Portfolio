'use client';

import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { QAPageSchema } from '@/lib/schemas';

export default function Home() {
  return (
    <>
      <QAPageSchema />
      <PortfolioLayout>
        <ChatInterface />
      </PortfolioLayout>
    </>
  );
}