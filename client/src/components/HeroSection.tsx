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

const HeroSection: React.FC = () => {
  const [mainImgError, setMainImgError] = useState(false);
  const [secondaryImgErrors, setSecondaryImgErrors] = useState<{[key: number]: boolean}>({});
  const fallbackImage = "https://via.placeholder.com/800x600?text=News+Media";

  const handleMainImageError = () => {
    setMainImgError(true);
  };

  const handleSecondaryImageError = (articleId: number) => {
    setSecondaryImgErrors(prev => ({
      ...prev,
      [articleId]: true
    }));
  };

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm">
                <div className="bg-gray-200 animate-pulse h-64 lg:h-80"></div>
                <div className="p-4">
                  <div className="bg-gray-200 animate-pulse h-6 w-32 mb-2"></div>
                  <div className="bg-gray-200 animate-pulse h-8 w-3/4 mb-3"></div>
                  <div className="bg-gray-200 animate-pulse h-4 w-full mb-3"></div>
                  <div className="bg-gray-200 animate-pulse h-4 w-32"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row lg:flex-col">
                    <div className="bg-gray-200 animate-pulse h-48 w-full sm:w-1/3 lg:w-full"></div>
                    <div className="p-4">
                      <div className="bg-gray-200 animate-pulse h-6 w-32 mb-2"></div>
                      <div className="bg-gray-200 animate-pulse h-6 w-3/4 mb-2"></div>
                      <div className="bg-gray-200 animate-pulse h-4 w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !articles || articles.length === 0) {
    return null;
  }

  const [mainArticle, ...secondaryArticles] = articles;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main featured article */}
          <div className="lg:col-span-2">
            <Link href={`/article/${mainArticle.slug}`}>
              <a className="block">
                <article className="bg-white shadow-sm hover:shadow-md transition">
                  <div>
                    <img 
                      src={mainImgError ? fallbackImage : mainArticle.imageUrl} 
                      alt={mainArticle.title} 
                      className="w-full aspect-[9/16] object-cover"
                      onError={handleMainImageError}
                    />
                    <div className="p-4">
                      <span className="bg-primary text-white text-xs px-2 py-1">
                        {mainArticle.category.charAt(0).toUpperCase() + mainArticle.category.slice(1)}
                      </span>
                      <h2 className="text-xl font-headline font-bold mt-2 mb-2">{mainArticle.title}</h2>
                      <p className="text-neutral-600 mb-2 line-clamp-2">{mainArticle.summary}</p>
                      <div className="flex items-center text-sm text-neutral-600">
                        <span className="mr-3">
                          <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={mainArticle.createdAt} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            </Link>
          </div>
          
          {/* Secondary featured articles */}
          <div className="space-y-6">
            {secondaryArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <a className="block">
                  <article className="bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row lg:flex-col">
                      <img 
                        src={secondaryImgErrors[article.id] ? fallbackImage : article.imageUrl} 
                        alt={article.title} 
                        className="w-full sm:w-1/3 lg:w-full aspect-[9/16] object-cover"
                        onError={() => handleSecondaryImageError(article.id)}
                      />
                      <div className="p-4 sm:w-2/3 lg:w-full">
                        <span className="bg-primary text-white text-xs px-2 py-1">
                          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                        </span>
                        <h2 className="text-xl font-headline font-bold mt-2 mb-3">{article.title}</h2>
                        <div className="flex items-center text-sm text-neutral-600">
                          <span className="mr-3">
                            <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={article.createdAt} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
