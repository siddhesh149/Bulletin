# Guide to Adding Content to News Media Website

This guide explains how to manually add articles and breaking news to your News Media website from your local environment.

## Prerequisites

1. Make sure PostgreSQL is installed and running
2. Ensure you have access to the database with the proper credentials
3. Your website codebase should be set up locally

## Adding Articles Manually

### Option 1: Using SQL Directly

You can add articles directly to the database using SQL commands:

```sql
INSERT INTO articles (
  title, 
  slug, 
  summary, 
  content, 
  image_url, 
  category, 
  author_name, 
  author_image_url, 
  published, 
  featured_order, 
  created_at, 
  updated_at
)
VALUES (
  'Your Article Title', 
  'your-article-slug', 
  'A brief summary of your article content', 
  '<p>Your article content with HTML formatting.</p><p>Add multiple paragraphs as needed.</p>', 
  'https://link-to-your-image.jpg', 
  'category-name',  -- Must be one of: politics, business, technology, sports, entertainment, health, science, world
  'Author Name', 
  'https://link-to-author-profile-image.jpg', 
  true,  -- Set to false if you want to draft it first
  null,  -- Optional: Set a number to feature it (lower numbers appear first)
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP
);
```

### Option 2: Using the API Endpoint

You can use the API endpoint to add articles:

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Article Title",
    "slug": "your-article-slug",
    "summary": "A brief summary of your article content",
    "content": "<p>Your article content with HTML formatting.</p><p>Add multiple paragraphs as needed.</p>",
    "imageUrl": "https://link-to-your-image.jpg",
    "category": "category-name",
    "authorName": "Author Name",
    "authorImageUrl": "https://link-to-author-profile-image.jpg",
    "published": true
  }'
```

## Adding Breaking News

### Using SQL Directly

```sql
INSERT INTO breaking_news (content, active, created_at)
VALUES (
  'Your breaking news content here', 
  true,  -- Set to true to make it active immediately
  CURRENT_TIMESTAMP
);
```

### Using the API Endpoint

```bash
curl -X POST http://localhost:5000/api/breaking-news \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your breaking news content here"
  }'
```

## Best Practices

1. **Slugs:** Make sure each article has a unique slug. Slugs are used in the URL.
2. **Images:** Use high-quality images with appropriate aspect ratios (16:9 recommended).
3. **Categories:** Only use the predefined categories in the system.
4. **Content:** Format content using HTML tags for proper display.
5. **Featured Articles:** To feature an article, set the `featured_order` to a low number (1, 2, 3, etc.).

## Database Schema Reference

Here's a quick reference of the database tables and fields:

### Articles Table

- `id`: Auto-incrementing primary key
- `title`: Article title (string)
- `slug`: URL-friendly version of the title (string, unique)
- `summary`: Brief summary of the article (string)
- `content`: Full article content with HTML formatting (text)
- `imageUrl`: URL to the article's main image (string)
- `category`: Category name (enum: politics, business, technology, etc.)
- `authorName`: Name of the author (string)
- `authorImageUrl`: URL to the author's profile image (string)
- `published`: Whether the article is published (boolean)
- `featuredOrder`: Order in the featured section (integer, nullable)
- `createdAt`: When the article was created (timestamp)
- `updatedAt`: When the article was last updated (timestamp)

### Breaking News Table

- `id`: Auto-incrementing primary key
- `content`: Breaking news content (string)
- `active`: Whether the breaking news is active (boolean)
- `createdAt`: When the breaking news was created (timestamp)