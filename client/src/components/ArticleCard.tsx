import React, { useState } from 'react';
import { Link } from 'wouter';
import TimeAgo from './TimeAgo';
import ViewCounter from './ViewCounter';

type ArticleCardProps = {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  imageUrl: string;
  category: string;
  viewCount: number;
  createdAt: string;
  compact?: boolean;
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    technology: 'bg-blue-600',
    business: 'bg-green-600',
    science: 'bg-purple-600',
    sports: 'bg-red-600',
    politics: 'bg-orange-600',
    entertainment: 'bg-pink-600',
    health: 'bg-teal-600',
    world: 'bg-indigo-600'
  };
  return colors[category.toLowerCase()] || 'bg-gray-600';
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  slug,
  summary,
  imageUrl,
  category,
  viewCount,
  createdAt,
  compact = false
}) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = "https://via.placeholder.com/800x600?text=News+Media";

  const handleImageError = () => {
    setImgError(true);
  };

  if (compact) {
    return (
      <Link href={`/article/${slug}`}>
        <a className="flex gap-3 hover:text-primary">
          <img 
            src={imgError ? fallbackImage : imageUrl} 
            alt={title} 
            className="w-20 h-20 object-cover rounded-md"
            onError={handleImageError}
          />
          <div>
            <h4 className="font-semibold leading-tight">{title}</h4>
            <span className="text-xs text-neutral-600">
              <TimeAgo timestamp={createdAt} />
            </span>
          </div>
        </a>
      </Link>
    );
  }

  return (
    <Link href={`/article/${slug}`}>
      <a className="block">
        <article className="bg-white shadow-sm hover:shadow-md transition rounded-lg overflow-hidden">
          <div className="relative">
            <img 
              src={imgError ? fallbackImage : imageUrl} 
              alt={title} 
              className="w-full h-48 object-cover"
              onError={handleImageError}
            />
            <span className={`absolute top-4 left-4 ${getCategoryColor(category)} text-white text-xs px-3 py-1 rounded-full font-medium shadow-md`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-headline font-bold mt-2 mb-2">{title}</h3>
            {summary && <p className="text-sm text-neutral-600 mb-2">{summary}</p>}
            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <span>
                <i className="far fa-clock mr-1"></i> <TimeAgo timestamp={createdAt} />
              </span>
              <ViewCounter count={viewCount} />
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
};

export default ArticleCard;
