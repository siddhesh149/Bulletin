import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TimeAgo from '@/components/TimeAgo';
import ViewCounter from '@/components/ViewCounter';
import ArticleCard from '@/components/ArticleCard';
import { Separator } from '@/components/ui/separator';

type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  viewCount: number;
  createdAt: string;
};

type ArticleResponse = {
  article: Article;
  relatedArticles: Article[];
};

const ArticlePage: React.FC = () => {
  const [match, params] = useRoute('/article/:slug');
  const slug = params?.slug || '';
  const [imgError, setImgError] = useState(false);
  const fallbackImage = "https://via.placeholder.com/800x600?text=News+Media";

  const handleImageError = () => {
    setImgError(true);
  };

  const { data, isLoading, error } = useQuery<ArticleResponse>({
    queryKey: [`/api/articles/${slug}`, slug],
    enabled: !!slug,
  });

  // Set title when article loads
  useEffect(() => {
    if (data?.article) {
      document.title = `${data.article.title} | Latest News Media`;
    }
    
    // Reset title on unmount
    return () => {
      document.title = 'Latest News Media - Latest News, Breaking News, Today\'s Headlines';
    };
  }, [data?.article]);

  if (isLoading) {
    return (
      <div className="bg-neutral-100 font-body text-neutral-800">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 mb-4"></div>
            <div className="bg-gray-200 h-4 w-full mb-4"></div>
            <div className="bg-gray-200 h-12 w-3/4 mb-4"></div>
            <div className="bg-gray-200 h-6 w-1/2 mb-6"></div>
            <div className="bg-gray-200 h-80 w-full mb-6"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-4 w-full"></div>
              <div className="bg-gray-200 h-4 w-full"></div>
              <div className="bg-gray-200 h-4 w-4/5"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-neutral-100 font-body text-neutral-800">
        <Header />
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-4">Sorry, we couldn't find the article you're looking for.</p>
          <Link href="/">
            <a className="text-primary hover:underline">Return to homepage</a>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { article, relatedArticles } = data;

  return (
    <div className="bg-neutral-100 font-body text-neutral-800">
      <Header />
      
      <section className="container mx-auto px-4 py-6">
        {/* Article header */}
        <div className="mb-6">
          <Link href="/">
            <a className="mb-4 text-primary">
              <i className="fas fa-arrow-left mr-1"></i> Back to News
            </a>
          </Link>
          
          <nav className="text-sm text-neutral-600 mb-4 mt-4">
            <ol className="flex flex-wrap">
              <li className="after:content-['/'] after:mx-2">
                <Link href="/">
                  <a className="hover:text-primary">Home</a>
                </Link>
              </li>
              <li className="after:content-['/'] after:mx-2">
                <Link href={`/category/${article.category}`}>
                  <a className="hover:text-primary">
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </a>
                </Link>
              </li>
              <li className="text-neutral-800 font-semibold truncate">
                <span>{article.title}</span>
              </li>
            </ol>
          </nav>
          
          <span className="bg-primary text-white text-xs px-2 py-1">
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-bold my-3">{article.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between py-3 border-t border-b text-sm">
            <div className="flex items-center mb-2 md:mb-0">
              <div>
                <div>
                  <span className="text-neutral-600">
                    <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={article.createdAt} />
                  </span>
                  <span className="text-neutral-600 ml-3">
                    <ViewCounter count={article.viewCount} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <figure className="mb-6">
              <img 
                src={imgError ? fallbackImage : article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto"
                onError={handleImageError}
              />
            </figure>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}>
            </div>
            
            {/* Tags */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold">Topics:</span>
                {article.category.split(',').map((tag, index) => (
                  <Link key={index} href={`/category/${tag.trim()}`}>
                    <a className="text-sm bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full">
                      {tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1)}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-100 p-4 mb-6">
              <h3 className="text-lg font-headline font-bold mb-3">Related Articles</h3>
              <ul className="space-y-4">
                {relatedArticles.map((related) => (
                  <li key={related.id}>
                    <ArticleCard 
                      id={related.id}
                      title={related.title}
                      slug={related.slug}
                      imageUrl={related.imageUrl}
                      category={related.category}
                      viewCount={related.viewCount}
                      createdAt={related.createdAt}
                      compact={true}
                    />
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-neutral-100 p-4">
              <h3 className="text-lg font-headline font-bold mb-3">Most Read in {article.category.charAt(0).toUpperCase() + article.category.slice(1)}</h3>
              <ol className="space-y-4 list-decimal list-inside">
                {relatedArticles.map((related) => (
                  <li key={related.id}>
                    <Link href={`/article/${related.slug}`}>
                      <a className="hover:text-primary">
                        <span className="font-semibold">{related.title}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;
