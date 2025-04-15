import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
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

interface CategorySectionProps {
  category: string;
  displayName: string;
  limit?: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  displayName, 
  limit = 3 
}) => {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${category}`, category],
    queryFn: getQueryFn<Article[]>({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">{displayName}</h2>
          <Link href={`/category/${category}`}>
            <a className="text-primary hover:underline">More {displayName} News</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-white shadow-sm">
              <div className="bg-gray-200 animate-pulse h-48"></div>
              <div className="p-4">
                <div className="bg-gray-200 animate-pulse h-6 mb-2"></div>
                <div className="bg-gray-200 animate-pulse h-4 mb-2"></div>
                <div className="bg-gray-200 animate-pulse h-4 w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !articles || articles.length === 0) {
    return null; // Don't show empty categories
  }

  // Limit the number of articles shown
  const displayArticles = articles.slice(0, limit);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline font-bold border-l-4 border-primary pl-3">{displayName}</h2>
        <Link href={`/category/${category}`}>
          <a className="text-primary hover:underline">More {displayName} News</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayArticles.map((article) => (
          <article key={article.id} className="bg-white shadow-sm">
            <Link href={`/article/${article.slug}`}>
              <a>
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-headline font-bold mb-2">{article.title}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{article.summary}</p>
                  <div className="flex items-center text-xs text-neutral-600">
                    <span className="mr-3">
                      <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={article.createdAt} />
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

// Helper for query function
function getQueryFn<T>(options: { on401: "returnNull" | "throw" }): (context: any) => Promise<T> {
  return async (context) => {
    const { queryKey } = context;
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (options.on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json() as T;
  };
}

export default CategorySection;
