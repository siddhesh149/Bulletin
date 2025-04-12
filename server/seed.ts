import { db } from './db';
import { articles, breakingNews, users } from '../shared/schema';
import { log } from './vite';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    log("Starting database seeding...");

    // Create a test user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const [adminUser] = await db.insert(users)
      .values({
        username: "admin",
        password: hashedPassword
      })
      .returning();
    
    log("Created admin user");

    // Create sample articles
    const sampleArticles = [
      {
        title: "The Future of AI in Journalism",
        slug: "future-of-ai-journalism",
        summary: "How artificial intelligence is transforming the news industry",
        content: "Artificial intelligence is revolutionizing how news is gathered, written, and distributed...",
        imageUrl: "https://source.unsplash.com/random/800x600/?technology",
        category: "technology",
        authorName: "John Smith",
        authorImageUrl: "https://source.unsplash.com/random/100x100/?person",
        published: true,
        featuredOrder: 1
      },
      {
        title: "Global Economic Trends 2024",
        slug: "global-economic-trends-2024",
        summary: "Analysis of major economic developments shaping the world",
        content: "The global economy continues to face unprecedented challenges and opportunities...",
        imageUrl: "https://source.unsplash.com/random/800x600/?business",
        category: "business",
        authorName: "Sarah Johnson",
        authorImageUrl: "https://source.unsplash.com/random/100x100/?woman",
        published: true,
        featuredOrder: 2
      },
      {
        title: "Climate Change: Latest Research",
        slug: "climate-change-research-2024",
        summary: "New findings in climate science and their implications",
        content: "Recent studies reveal accelerating impacts of climate change across the globe...",
        imageUrl: "https://source.unsplash.com/random/800x600/?climate",
        category: "science",
        authorName: "Dr. Michael Chen",
        authorImageUrl: "https://source.unsplash.com/random/100x100/?scientist",
        published: true,
        featuredOrder: 3
      },
      {
        title: "Sports Review: Major Events",
        slug: "sports-review-major-events",
        summary: "Recap of the biggest sporting events and achievements",
        content: "This year has seen remarkable achievements in various sports disciplines...",
        imageUrl: "https://source.unsplash.com/random/800x600/?sports",
        category: "sports",
        authorName: "Alex Thompson",
        authorImageUrl: "https://source.unsplash.com/random/100x100/?athlete",
        published: true
      }
    ];

    await db.insert(articles).values(sampleArticles);
    log("Created sample articles");

    // Create sample breaking news
    const sampleBreakingNews = [
      {
        content: "Breaking: Major technological breakthrough in renewable energy announced",
        active: true
      },
      {
        content: "Update: International space mission successfully completed",
        active: true
      }
    ];

    await db.insert(breakingNews).values(sampleBreakingNews);
    log("Created sample breaking news");

    log("Seeding completed successfully!");
    process.exit(0);
  } catch (error: any) {
    log(`Seeding failed: ${error?.message}`);
    process.exit(1);
  }
}

seed(); 