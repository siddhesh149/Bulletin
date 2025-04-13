import { db } from './db';
import { articles, users, breakingNews, articleViews } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('[express] Starting database seeding...');
  
  try {
    const conn = await db;
    console.log('[express] Database connection established');

    // Clear existing data in correct order
    await conn.delete(articleViews);
    await conn.delete(articles);
    await conn.delete(users);
    await conn.delete(breakingNews);
    console.log('[express] Cleared existing data');

    // Create admin user
    const [user] = await conn.insert(users).values({
      username: 'admin',
      password: 'admin123' // In production, use hashed password
    }).returning();
    console.log('[express] Created admin user');

    // Create sample articles
    await conn.insert(articles).values([
      {
        title: 'The Future of AI in Journalism',
        slug: 'future-of-ai-in-journalism',
        summary: 'Exploring how artificial intelligence is transforming news reporting and content creation.',
        content: 'Full article content here...',
        imageUrl: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
        category: 'technology',
        authorName: 'John Doe',
        authorImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        featuredOrder: 1
      },
      {
        title: 'Global Economic Trends 2024',
        slug: 'global-economic-trends-2024',
        summary: 'Analysis of emerging economic patterns and their impact on global markets.',
        content: 'Full article content here...',
        imageUrl: 'https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg',
        category: 'business',
        authorName: 'Jane Smith',
        authorImageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        featuredOrder: 2
      },
      {
        title: 'Breakthrough in Quantum Computing',
        slug: 'breakthrough-in-quantum-computing',
        summary: 'Scientists achieve major milestone in quantum computing research.',
        content: 'Full article content here...',
        imageUrl: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
        category: 'science',
        authorName: 'Dr. Sarah Johnson',
        authorImageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
      }
    ]);
    console.log('[express] Created sample articles');

    // Create breaking news
    await conn.insert(breakingNews).values({
      content: 'Breaking: Major technological breakthrough announced!',
      active: true
    });
    console.log('[express] Created breaking news');

    console.log('[express] Database seeding completed successfully!');
  } catch (error: any) {
    console.error('[express] Error seeding database:', error.message);
    if (error.detail) {
      console.error('[express] Error detail:', error.detail);
    }
    throw error;
  }
}

seed().catch((error) => {
  console.error('[express] Database seeding failed:', error);
  process.exit(1);
}); 