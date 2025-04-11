import React from 'react';
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
  if (compact) {
    return (
      <Link href={`/article/${slug}`}>
        <a className="flex gap-3 hover:text-primary">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-20 h-20 object-cover"
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
        <article className="bg-white shadow-sm hover:shadow-md transition">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <span className="bg-primary text-white text-xs px-2 py-1">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <h3 className="text-lg font-headline font-bold mt-2 mb-2">{title}</h3>
            {summary && <p className="text-sm text-neutral-600 mb-2">{summary}</p>}
            <div className="flex items-center text-sm text-neutral-600">
              <span className="mr-3">
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
