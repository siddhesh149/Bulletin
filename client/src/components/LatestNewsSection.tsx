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
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">Latest News</h2>
          <a href="#" className="text-primary hover:underline">View All</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {latestArticles.slice(0, 10).map((article) => (
            <article key={article.id} className="border-b pb-4 md:border-b-0 md:pb-0">
              <Link href={`/article/${article.slug}`}>
                <a>
                  <img 
                    src={imgErrors[article.id] ? fallbackImage : article.imageUrl} 
                    alt={article.title} 
                    className="w-full aspect-[9/16] object-cover mb-2"
                    onError={() => handleImageError(article.id)}
                  />
                  <span className="bg-primary text-white text-xs px-2 py-1">
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  <h3 className="text-base font-headline font-bold mt-2 mb-1 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center text-xs text-neutral-600">
                    <span>
                      <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={article.createdAt} />
                    </span>
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
