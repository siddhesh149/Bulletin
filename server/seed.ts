import { db } from './db';
import { articles, users, breakingNews, articleViews } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('[express] Starting database seeding...');
  
  try {
    const conn = await db;
    console.log('[express] Database connection established');

    // Clear existing data in correct order
    console.log('[express] Clearing existing data...');
    await conn.delete(articleViews);
    await conn.delete(articles);
    await conn.delete(users);
    await conn.delete(breakingNews);
    console.log('[express] Cleared existing data');

    // Create admin user
    console.log('[express] Creating admin user...');
    const [user] = await conn.insert(users).values({
      username: 'admin',
      password: 'admin123' // In production, use hashed password
    }).returning();
    console.log('[express] Created admin user:', user);

    // Create sample articles
    console.log('[express] Creating sample articles...');
    const createdArticles = await conn.insert(articles).values([
      // Featured Articles
      {
        title: 'The Future of AI in Journalism',
        slug: 'future-of-ai-in-journalism',
        summary: 'Exploring how artificial intelligence is transforming news reporting and content creation.',
        content: '<p>Artificial intelligence is revolutionizing the way news is gathered, written, and distributed. From automated reporting to personalized content delivery, AI is changing the landscape of journalism.</p><p>Major news organizations are increasingly adopting AI tools to enhance their reporting capabilities and streamline their operations.</p>',
        imageUrl: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
        category: 'technology',
        authorName: 'John Doe',
        tags: JSON.stringify(['AI', 'journalism', 'technology', 'media']),
        featuredOrder: 1
      },
      {
        title: 'Global Economic Trends 2024',
        slug: 'global-economic-trends-2024',
        summary: 'Analysis of emerging economic patterns and their impact on global markets.',
        content: '<p>The global economy is showing signs of resilience despite ongoing challenges. Markets are adapting to new realities while technology continues to drive innovation across sectors.</p><p>Experts predict significant shifts in traditional economic models as digital transformation accelerates.</p>',
        imageUrl: 'https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg',
        category: 'business',
        authorName: 'Jane Smith',
        tags: JSON.stringify(['economics', 'markets', 'finance', 'trends']),
        featuredOrder: 2
      },
      {
        title: 'Breakthrough in Quantum Computing',
        slug: 'breakthrough-in-quantum-computing',
        summary: 'Scientists achieve major milestone in quantum computing research.',
        content: '<p>Researchers have announced a significant breakthrough in quantum computing technology. This development could revolutionize fields from cryptography to drug discovery.</p><p>The new quantum processor demonstrates unprecedented stability and error correction capabilities.</p>',
        imageUrl: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
        category: 'science',
        authorName: 'Dr. Sarah Johnson',
        tags: JSON.stringify(['quantum computing', 'research', 'technology', 'science']),
        featuredOrder: 3
      },

      // Must Read Articles
      {
        title: 'The Impact of Social Media on Mental Health',
        slug: 'impact-of-social-media-on-mental-health',
        summary: 'Comprehensive study reveals the long-term effects of social media usage on mental wellbeing.',
        content: '<p>A groundbreaking study has revealed significant correlations between social media usage patterns and mental health outcomes.</p><p>Researchers highlight both positive and negative impacts, suggesting balanced usage guidelines.</p>',
        imageUrl: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg',
        category: 'health',
        authorName: 'Dr. Amanda Chen',
        tags: JSON.stringify(['mental health', 'social media', 'wellness', 'research']),
        featuredOrder: 4
      },
      {
        title: 'Global Warming: Point of No Return',
        slug: 'global-warming-point-of-no-return',
        summary: 'Scientists warn of critical climate threshold as global temperatures continue to rise.',
        content: '<p>Climate scientists have identified a crucial tipping point in global warming trends.</p><p>New data suggests immediate action is required to prevent irreversible environmental changes.</p>',
        imageUrl: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg',
        category: 'science',
        authorName: 'Dr. Robert Green',
        tags: JSON.stringify(['climate change', 'environment', 'global warming', 'science']),
        featuredOrder: 5
      },

      // Regular Articles
      {
        title: 'Major Political Reforms Announced',
        slug: 'major-political-reforms-announced',
        summary: 'Government unveils comprehensive package of political reforms.',
        content: '<p>The government has announced a series of major political reforms aimed at modernizing the political system and enhancing democratic processes.</p><p>These changes are expected to have far-reaching implications for governance and civic participation.</p>',
        imageUrl: 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg',
        category: 'politics',
        authorName: 'Michael Wilson',
        tags: JSON.stringify(['politics', 'reforms', 'government', 'democracy'])
      },

      // Related Tech Articles
      {
        title: 'The Rise of Edge Computing',
        slug: 'rise-of-edge-computing',
        summary: 'Edge computing transforms data processing in IoT devices.',
        content: '<p>Edge computing is revolutionizing how IoT devices process and transmit data.</p><p>This technology enables faster response times and reduced bandwidth usage.</p>',
        imageUrl: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
        category: 'technology',
        authorName: 'Tech Expert',
        tags: JSON.stringify(['edge computing', 'IoT', 'technology', 'innovation'])
      },
      {
        title: '5G Networks: The Next Frontier',
        slug: '5g-networks-next-frontier',
        summary: 'How 5G technology is reshaping connectivity and communication.',
        content: '<p>5G networks are transforming digital connectivity with unprecedented speeds and reliability.</p><p>Industries are adapting to leverage these new capabilities.</p>',
        imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
        category: 'technology',
        authorName: 'Tech Analyst',
        tags: JSON.stringify(['5G', 'networks', 'technology', 'communication'])
      },

      // Health & Science
      {
        title: 'Revolutionary Cancer Treatment Shows Promise',
        slug: 'revolutionary-cancer-treatment-shows-promise',
        summary: 'New immunotherapy approach demonstrates unprecedented success rates.',
        content: '<p>A groundbreaking cancer treatment using modified immune cells has shown remarkable results in clinical trials.</p><p>This innovative approach could transform how we treat various types of cancer.</p>',
        imageUrl: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg',
        category: 'health',
        authorName: 'Dr. Emily Chen',
        tags: JSON.stringify(['health', 'cancer', 'medicine', 'research'])
      },

      // Sports & Entertainment
      {
        title: 'World Cup Final Sets Viewership Record',
        slug: 'world-cup-final-sets-viewership-record',
        summary: 'Historic match breaks global television and streaming records.',
        content: '<p>The latest World Cup final has shattered all previous viewership records, with billions of viewers tuning in worldwide.</p><p>The match has been hailed as one of the greatest sporting events in history.</p>',
        imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
        category: 'sports',
        authorName: 'Tom Richards',
        tags: JSON.stringify(['sports', 'football', 'world cup', 'records'])
      },
      {
        title: 'Entertainment Industry Embraces Virtual Reality',
        slug: 'entertainment-industry-embraces-virtual-reality',
        summary: 'Major studios announce ambitious VR entertainment projects.',
        content: '<p>The entertainment industry is making a significant pivot towards virtual reality, with major studios announcing groundbreaking VR projects.</p><p>This shift could revolutionize how we consume entertainment.</p>',
        imageUrl: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg',
        category: 'entertainment',
        authorName: 'Lisa Zhang',
        tags: JSON.stringify(['entertainment', 'VR', 'technology', 'media'])
      },

      // Similar Articles in Science
      {
        title: 'Artificial Intelligence in Healthcare',
        slug: 'artificial-intelligence-in-healthcare',
        summary: 'AI technologies revolutionize medical diagnosis and treatment.',
        content: '<p>Healthcare institutions are increasingly adopting AI-powered solutions for improved diagnosis and patient care.</p><p>Machine learning algorithms are showing promising results in early disease detection.</p>',
        imageUrl: 'https://images.pexels.com/photos/3825578/pexels-photo-3825578.jpeg',
        category: 'science',
        authorName: 'Dr. James Wilson',
        tags: JSON.stringify(['AI', 'healthcare', 'technology', 'medicine'])
      }
    ]).returning();
    console.log(`[express] Created ${createdArticles.length} sample articles`);

    // Verify articles were created
    const allArticles = await conn.select().from(articles);
    console.log(`[express] Total articles in database: ${allArticles.length}`);

    // Create breaking news
    console.log('[express] Creating breaking news...');
    const createdNews = await conn.insert(breakingNews).values([
      {
        content: 'Breaking: Major technological breakthrough announced in quantum computing!',
        active: true
      },
      {
        content: 'Urgent: Global climate summit reaches historic agreement',
        active: true
      },
      {
        content: 'Just In: Revolutionary cancer treatment shows 90% success rate in trials',
        active: true
      }
    ]).returning();
    console.log(`[express] Created ${createdNews.length} breaking news items`);

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