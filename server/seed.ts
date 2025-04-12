import { db, createDbConnection } from './db';
import { articles, breakingNews, users } from '../shared/schema';
import { log } from './vite';
import bcrypt from 'bcrypt';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function seed() {
  let retries = 5;
  while (retries > 0) {
    try {
      log("Starting database seeding...");

      // Ensure database connection is established
      await createDbConnection();
      log("Database connection established");

      // Clear existing data
      await db.delete(breakingNews);
      await db.delete(articles);
      await db.delete(users);
      log("Cleared existing data");

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
          content: "Artificial intelligence is revolutionizing how news is gathered, written, and distributed. From automated content generation to personalized news delivery, AI is reshaping journalism in unprecedented ways. This article explores the latest developments and their implications for the future of news media.",
          imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
          category: "technology",
          authorName: "John Smith",
          authorImageUrl: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
          published: true,
          featuredOrder: 1
        },
        {
          title: "Global Economic Trends 2024",
          slug: "global-economic-trends-2024",
          summary: "Analysis of major economic developments shaping the world",
          content: "The global economy continues to face unprecedented challenges and opportunities. From emerging markets to technological disruption, this comprehensive analysis examines key trends that will shape economic landscapes in 2024 and beyond.",
          imageUrl: "https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg",
          category: "business",
          authorName: "Sarah Johnson",
          authorImageUrl: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
          published: true,
          featuredOrder: 2
        },
        {
          title: "Climate Change: Latest Research",
          slug: "climate-change-research-2024",
          summary: "New findings in climate science and their implications",
          content: "Recent studies reveal accelerating impacts of climate change across the globe. This article presents the latest research findings, their implications for our planet, and potential solutions being developed by scientists worldwide.",
          imageUrl: "https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg",
          category: "science",
          authorName: "Dr. Michael Chen",
          authorImageUrl: "https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg",
          published: true,
          featuredOrder: 3
        },
        {
          title: "Major Political Reforms Announced",
          slug: "major-political-reforms-2024",
          summary: "Key policy changes and their impact on governance",
          content: "Recent political developments have led to significant reforms in governance and policy-making. This comprehensive analysis examines the implications of these changes and their potential impact on various sectors of society.",
          imageUrl: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg",
          category: "politics",
          authorName: "Emily Rodriguez",
          authorImageUrl: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg",
          published: true,
          featuredOrder: 4
        },
        {
          title: "Breakthrough in Medical Research",
          slug: "medical-breakthrough-2024",
          summary: "Revolutionary treatment shows promising results",
          content: "Scientists have announced a significant breakthrough in medical research, potentially transforming how we treat various conditions. This article explores the implications of this discovery and its potential impact on healthcare.",
          imageUrl: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
          category: "health",
          authorName: "Dr. Amanda White",
          authorImageUrl: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg",
          published: true
        },
        {
          title: "Entertainment Industry Evolution",
          slug: "entertainment-industry-evolution",
          summary: "How digital platforms are reshaping entertainment",
          content: "The entertainment industry is undergoing a massive transformation with the rise of digital platforms and changing consumer preferences. This analysis explores the latest trends and future predictions.",
          imageUrl: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg",
          category: "entertainment",
          authorName: "Mark Thompson",
          authorImageUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
          published: true
        },
        {
          title: "Sports Review: Major Events",
          slug: "sports-review-major-events",
          summary: "Recap of the biggest sporting events and achievements",
          content: "This year has seen remarkable achievements in various sports disciplines. From record-breaking performances to unexpected victories, we cover the most significant moments that defined sports in recent times.",
          imageUrl: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
          category: "sports",
          authorName: "Alex Thompson",
          authorImageUrl: "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg",
          published: true
        },
        {
          title: "Global Diplomatic Developments",
          slug: "global-diplomatic-developments",
          summary: "Key international relations and diplomatic events",
          content: "Recent diplomatic developments have reshaped international relations and global cooperation. This article examines the major events and their implications for world politics.",
          imageUrl: "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg",
          category: "world",
          authorName: "David Wilson",
          authorImageUrl: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
          published: true
        }
      ];

      await db.insert(articles)
        .values(sampleArticles)
        .returning();
      log("Created sample articles");

      // Create breaking news
      await db.insert(breakingNews)
        .values({
          content: "Welcome to NewsBulletin! Stay tuned for the latest updates across technology, business, politics, and more.",
          active: true
        })
        .returning();
      log("Created breaking news");

      log("Database seeding completed successfully!");
      process.exit(0);
    } catch (error: any) {
      retries--;
      if (retries === 0) {
        log(`Seeding failed after all retries: ${error?.message}`);
        if (error.detail) log(`Error detail: ${error.detail}`);
        process.exit(1);
      }
      log(`Seeding attempt failed, retrying in 5 seconds... (${retries} retries left)`);
      log(`Error details: ${error?.message}`);
      if (error.detail) log(`Error detail: ${error.detail}`);
      await sleep(5000);
    }
  }
}

seed(); 