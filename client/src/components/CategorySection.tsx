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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-headline font-bold border-l-4 border-primary pl-3">{displayName}</h2>
        <Link href={`/category/${category}`}>
          <a className="text-primary hover:underline text-sm">More {displayName} News</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
            <Link href={`/article/${article.slug}`}>
              <a>
                <div className="relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full aspect-video object-cover rounded-t-lg"
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
