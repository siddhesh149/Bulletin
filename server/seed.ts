import { db } from './db';
import { articles, breakingNews } from '../shared/schema';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    // Create sample articles
    const sampleArticles = Array.from({ length: 10 }, () => ({
      title: faker.lorem.sentence(),
      slug: faker.helpers.slugify(faker.lorem.sentence()),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs(3),
      imageUrl: faker.image.urlLoremFlickr({ category: 'business' }),
      category: faker.helpers.arrayElement(['business', 'technology', 'politics', 'sports']),
      authorName: faker.person.fullName(),
      authorImageUrl: faker.image.avatar(),
      published: true,
      featuredOrder: faker.helpers.arrayElement([1, 2, 3, null]),
    }));

    await db.insert(articles).values(sampleArticles);

    // Create sample breaking news
    const sampleBreakingNews = Array.from({ length: 2 }, () => ({
      content: faker.lorem.sentence(),
      active: true,
    }));

    await db.insert(breakingNews).values(sampleBreakingNews);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seed(); 