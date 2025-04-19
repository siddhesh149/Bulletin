import React, { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { getQueryFn } from '../lib/queryClient';

type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  category: string;
  createdAt: string;
};

const ARTICLES_PER_PAGE = 9;

const CategoryPage: React.FC = () => {
  const [match, params] = useRoute('/category/:category');
  const category = params?.category || '';
  const [page, setPage] = React.useState(1);

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${category.toLowerCase()}?limit=${ARTICLES_PER_PAGE}&offset=${(page - 1) * ARTICLES_PER_PAGE}`, category, page],
    queryFn: getQueryFn<Article[]>({ on401: "throw" }),
    enabled: !!category,
  });

  // Set title when category loads
  useEffect(() => {
    if (category) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      document.title = `${categoryName} | Latest News Media`;
    }
    
    // Reset title on unmount
    return () => {
      document.title = 'Latest News Media - Latest News, Breaking News, Today\'s Headlines';
    };
  }, [category]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="bg-neutral-100 font-body text-neutral-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <a className="text-primary hover:underline mr-2">Home</a>
          </Link>
          <span className="mx-2">/</span>
          <h1 className="text-2xl md:text-3xl font-headline font-bold">{displayName}</h1>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(ARTICLES_PER_PAGE)].map((_, i) => (
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
        ) : error ? (
          <div className="bg-white p-6 text-center">
            <p className="text-red-500">Error loading articles. Please try again later.</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  slug={article.slug}
                  summary={article.summary}
                  imageUrl={article.imageUrl}
                  category={article.category}
                  createdAt={article.createdAt}
                  size="small"
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious size="default" onClick={() => page > 1 && handlePageChange(page - 1)} />
                  </PaginationItem>
                  {[...Array(3)].map((_, i) => {
                    const pageNumber = page - 1 + i;
                    if (pageNumber > 0) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <a
                            onClick={() => handlePageChange(pageNumber)}
                            className={`cursor-pointer px-4 py-2 ${pageNumber === page ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                          >
                            {pageNumber}
                          </a>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      size="default"
                      onClick={() => articles.length === ARTICLES_PER_PAGE && handlePageChange(page + 1)} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 text-center">
            <p>No articles found in this category.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
