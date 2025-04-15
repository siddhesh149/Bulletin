NEWS BULLETIN - ADMIN GUIDE
=======================

This guide explains how to manage articles in the News Bulletin website, including adding, deleting, featuring articles, and database handling.

TABLE OF CONTENTS
----------------
1. Adding Articles
2. Deleting Articles
3. Featuring Articles (Headlines & Top Placement)
4. Database Handling
5. Troubleshooting

1. ADDING ARTICLES
-----------------
To add a new article to the website:

a) Using the Admin Interface:
   - Log in to the admin dashboard
   - Click on "Add New Article"
   - Fill in the required fields:
     * Title: The headline of your article
     * Slug: URL-friendly version of the title (auto-generated)
     * Summary: A brief description of the article (shown in previews)
     * Content: The full article content (supports HTML formatting)
     * Image URL: URL to the article's featured image
     * Category: Select from existing categories or create a new one
     * Author Name: Name of the article author
     * Tags: Comma-separated keywords for the article
   - Click "Publish" to make the article live or "Save as Draft" to save it for later

b) Using the API:
   - Send a POST request to `/api/articles` with the following JSON body:
   ```
   {
     "title": "Your Article Title",
     "slug": "your-article-slug",
     "summary": "Brief summary of the article",
     "content": "Full article content with HTML formatting",
     "imageUrl": "https://example.com/image.jpg",
     "category": "Category Name",
     "authorName": "Author Name",
     "tags": "tag1, tag2, tag3"
   }
   ```

2. DELETING ARTICLES
-------------------
To delete an article:

a) Using the Admin Interface:
   - Log in to the admin dashboard
   - Navigate to "Articles" section
   - Find the article you want to delete
   - Click the "Delete" button next to the article
   - Confirm the deletion

b) Using the API:
   - Send a DELETE request to `/api/articles/{articleId}`
   - Replace {articleId} with the actual ID of the article you want to delete

3. FEATURING ARTICLES (HEADLINES & TOP PLACEMENT)
-----------------------------------------------
To feature an article in the headline section or place it at the top:

a) Using the Admin Interface:
   - Log in to the admin dashboard
   - Navigate to "Articles" section
   - Find the article you want to feature
   - Click "Edit" on the article
   - In the "Featured" section, set the "Featured Order" value:
     * 1: Will appear as the main headline (large view at the top)
     * 2-4: Will appear in the featured articles section below the headline
     * Leave empty or set to 0: Will not be featured
   - Save the changes

b) Using the API:
   - Send a PUT request to `/api/articles/{articleId}` with the following JSON body:
   ```
   {
     "featuredOrder": 1  // 1 for main headline, 2-4 for featured section, 0 or null for not featured
   }
   ```

4. DATABASE HANDLING
-------------------
The News Bulletin uses a PostgreSQL database with the following main tables:

a) Articles Table:
   - id: UUID (primary key)
   - title: String
   - slug: String (unique)
   - summary: String
   - content: String
   - image_url: String
   - category: String
   - author_name: String
   - tags: String (JSON array)
   - published: Boolean
   - featured_order: Integer
   - created_at: Timestamp
   - updated_at: Timestamp

b) Breaking News Table:
   - id: UUID (primary key)
   - content: String
   - active: Boolean
   - created_at: Timestamp
   - updated_at: Timestamp

Database Operations:
- To backup the database: Use pg_dump utility
- To restore the database: Use psql utility
- To modify the database schema: Update the migration files in the server/migrate.ts file

5. TROUBLESHOOTING
-----------------
Common issues and solutions:

a) Article not appearing:
   - Check if the article is published (published = true)
   - Verify the category is correct
   - Ensure the image URL is valid

b) Featured article not showing in the headline:
   - Verify the featuredOrder is set to 1
   - Check if there are other articles with featuredOrder = 1 (only one article can be the main headline)

c) Database connection issues:
   - Check the database connection string in the .env file
   - Verify the database server is running
   - Check for network connectivity issues

For additional help, contact the system administrator. 