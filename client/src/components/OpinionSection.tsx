import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import TimeAgo from './TimeAgo';

type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  authorName: string;
  authorImageUrl: string;
  createdAt: string;
};

const OpinionSection: React.FC = () => {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles/category/opinion'],
  });

  if (isLoading) {
    return (
      <section className="py-6 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">Opinion & Analysis</h2>
            <Link href="/category/opinion">
              <a className="text-primary hover:underline">More Opinion</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white shadow-sm flex">
                <div className="p-4 flex-grow">
                  <div className="bg-gray-200 animate-pulse h-6 mb-2"></div>
                  <div className="bg-gray-200 animate-pulse h-4 mb-2"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-200 animate-pulse w-8 h-8 rounded-full mr-2"></div>
                      <div className="bg-gray-200 animate-pulse h-4 w-24"></div>
                    </div>
                    <div className="bg-gray-200 animate-pulse h-4 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !articles || articles.length === 0) {
    return null; // Don't show empty opinion section
  }

  // Limit to 4 opinion articles
  const displayArticles = articles.slice(0, 4);

  return (
    <section className="py-6 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">Opinion & Analysis</h2>
          <Link href="/category/opinion">
            <a className="text-primary hover:underline">More Opinion</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayArticles.map((article) => (
            <article key={article.id} className="bg-white shadow-sm flex">
              <div className="p-4 flex-grow">
                <Link href={`/article/${article.slug}`}>
                  <a>
                    <h3 className="text-xl font-headline font-bold mb-2">{article.title}</h3>
                    <p className="text-sm text-neutral-600 mb-2">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={article.authorImageUrl || 'https://via.placeholder.com/40'} 
                          alt={article.authorName} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm font-semibold">{article.authorName}</span>
                      </div>
                      <span className="text-xs text-neutral-600">
                        <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={article.createdAt} />
                      </span>
                    </div>
                  </a>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpinionSection;
