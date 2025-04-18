import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ArticleCard from './ArticleCard';
import TimeAgo from './TimeAgo';

type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  category: string;
  createdAt: string;
};

const LatestNewsSection: React.FC = () => {
  const [imgErrors, setImgErrors] = useState<{[key: number]: boolean}>({});
  const fallbackImage = "https://via.placeholder.com/800x600?text=News+Media";

  const handleImageError = (articleId: number) => {
    setImgErrors(prev => ({
      ...prev,
      [articleId]: true
    }));
  };

  const { data: latestArticles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles/latest'],
  });

  if (isLoading) {
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">Latest News</h2>
            <Link href="/latest">
              <a className="text-primary hover:underline">View All</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b pb-4 md:border-b-0 md:pb-0">
                <div className="bg-gray-200 animate-pulse h-48 mb-3"></div>
                <div className="bg-gray-200 animate-pulse h-6 w-20 mb-2"></div>
                <div className="bg-gray-200 animate-pulse h-10 mb-2"></div>
                <div className="bg-gray-200 animate-pulse h-4 w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !latestArticles || latestArticles.length === 0) {
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">Latest News</h2>
          </div>
          <div className="bg-white p-6 text-center">
            <p className="text-red-500">Unable to load latest articles</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-headline font-bold border-l-4 border-primary pl-3">Latest News</h2>
          <Link href="/latest">
            <a className="text-primary hover:underline text-sm">View All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {latestArticles.slice(0, 12).map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
              <Link href={`/article/${article.slug}`}>
                <a>
                  <div className="relative">
                    <img 
                      src={imgErrors[article.id] ? fallbackImage : article.imageUrl} 
                      alt={article.title} 
                      className="w-full aspect-video object-cover rounded-t-lg"
                      onError={() => handleImageError(article.id)}
                    />
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </span>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-headline font-semibold mb-1 line-clamp-2 hover:text-primary">{article.title}</h3>
                    <div className="flex items-center text-xs text-neutral-500">
                      <i className="far fa-clock mr-1"></i>
                      <TimeAgo timestamp={article.createdAt} />
                    </div>
                  </div>
                </a>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSection;
