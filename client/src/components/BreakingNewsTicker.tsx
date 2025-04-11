import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type BreakingNews = {
  id: number;
  content: string;
  active: boolean;
  createdAt: string;
};

const BreakingNewsTicker: React.FC = () => {
  const { data: breakingNews, isLoading, error } = useQuery<BreakingNews[]>({
    queryKey: ['/api/breaking-news'],
    refetchInterval: 60000, // Refetch every minute
  });

  // Use fallback content if loading or error
  const newsContent = !isLoading && !error && breakingNews && breakingNews.length > 0
    ? breakingNews.map(news => news.content).join(' — ')
    : "Loading breaking news...";

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="flex">
          <div className="font-bold whitespace-nowrap mr-4">BREAKING NEWS:</div>
          <div className="overflow-hidden">
            <p className="breaking-news-ticker whitespace-nowrap inline-block">
              {newsContent}
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .breaking-news-ticker {
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default BreakingNewsTicker;
