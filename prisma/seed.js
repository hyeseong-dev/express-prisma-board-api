import prisma from './client.js';
import { faker } from '@faker-js/faker';
import { exclude, encrypt_password } from '../utils/service.js'

const instanceCache = {};

async function getRandomInstanceId(model) {
  if (!instanceCache[model]) {
    instanceCache[model] = await prisma[model].findMany();

  }
  const instanceIds = instanceCache[model].map(instance => instance.id);
  const randomIndex = Math.floor(Math.random() * instanceIds.length);
  return instanceIds[randomIndex];
}

const CATEGORY_LENGTH = 10;
const OTHER_LENGTH = 1000;

async function seedCategories() {
  const categories = Array.from({ length: CATEGORY_LENGTH }, () => {
    const name = faker.commerce.department().toLowerCase();
    return { name };
  });
  await prisma.category.createMany({ data: categories, skipDuplicates: true });
  console.log(CATEGORY_LENGTH, '카테고리 생성 완료');
}

async function seedUsers() {
  const users = Array.from({ length: OTHER_LENGTH }, async () => {
    const email = faker.internet.email()
    return {
      name: faker.name.fullName(),
      email,
      password: await encrypt_password('test1234'),
    };
  });
  await prisma.user.createMany({ data: await Promise.all(users) });
  console.log(OTHER_LENGTH, '유저 생성 완료');
}

async function seedPosts() {
  const posts = Array.from({ length: OTHER_LENGTH }, async () => {
    return {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      authorId: await getRandomInstanceId('user'),
      categoryId: await getRandomInstanceId('category'),
    };
  });
  await prisma.post.createMany({ data: await Promise.all(posts) });
  console.log(OTHER_LENGTH, '포스트 생성 완료');
}

async function seedComments() {
  const comments = Array.from({ length: OTHER_LENGTH }, async () => {
    return {
      message: faker.lorem.sentence(),
      userId: await getRandomInstanceId('user'),
      postId: await getRandomInstanceId('post'),
    };
  });
  await prisma.comment.createMany({ data: await Promise.all(comments) });
  console.log(OTHER_LENGTH, '댓글 생성 완료');
}

async function seedLikes() {
  const likes = Array.from({ length: OTHER_LENGTH }, async () => {
    return {
      userId: await getRandomInstanceId('user'),
      postId: await getRandomInstanceId('post'),
      commentId: await getRandomInstanceId('comment'),
    };
  });
  await prisma.like.createMany({ data: await Promise.all(likes), skipDuplicates: true });
  console.log(OTHER_LENGTH, '좋아요 생성 완료');
}

async function seedData() {
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();

  await Promise.all([
  seedCategories()
  .then(seedUsers)
  .then(seedPosts)
  .then(seedComments)
  .then(seedLikes)
  .catch((err) => console.error(err))
  ]);
}

seedData();