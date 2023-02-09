import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  const lee = await prisma.user.create({ data: { name: "이혜성", email:"hyeseong43@gmail.com", password:"test1234"  } })
  const sally = await prisma.user.create({ data: { name: "샐리", email:"sally@gmail.com", password:"test1234"  } })
  

  const c1 = await prisma.category.create({ data: { name: "IT"}})
  const c2 = await prisma.category.create({ data: { name: "Culture"}})

  const post1 = await prisma.post.create({
    data: {
        title: "Post 1",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat urna vel ante volutpat, ut elementum mi placerat. Phasellus varius nisi a nisl interdum, at ultrices ex tincidunt. Duis nec nunc vel urna ullamcorper eleifend ac id dolor. Phasellus vitae tortor ac metus laoreet rutrum. Aenean condimentum consequat elit, ut placerat massa mattis vitae. Vivamus dictum faucibus massa, eget euismod turpis pretium a. Aliquam rutrum rhoncus mi, eu tincidunt mauris placerat nec. Nunc sagittis libero sed facilisis suscipit. Curabitur nisi lacus, ullamcorper eu maximus quis, malesuada sit amet nisi. Proin dignissim, lacus vitae mattis fermentum, dui dolor feugiat turpis, ut euismod libero purus eget dui.",
        authorId: lee.id,
        categoryId: c1.id,
    },
  })
  const post2 = await prisma.post.create({
    data: {
        title: "Post 2",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat urna vel ante volutpat, ut elementum mi placerat. Phasellus varius nisi a nisl interdum, at ultrices ex tincidunt. Duis nec nunc vel urna ullamcorper eleifend ac id dolor. Phasellus vitae tortor ac metus laoreet rutrum. Aenean condimentum consequat elit, ut placerat massa mattis vitae. Vivamus dictum faucibus massa, eget euismod turpis pretium a. Aliquam rutrum rhoncus mi, eu tincidunt mauris placerat nec. Nunc sagittis libero sed facilisis suscipit. Curabitur nisi lacus, ullamcorper eu maximus quis, malesuada sit amet nisi. Proin dignissim, lacus vitae mattis fermentum, dui dolor feugiat turpis, ut euismod libero purus eget dui.",
        authorId: lee.id,
        categoryId: c1.id,
    },
  })
  const post3 = await prisma.post.create({
    data: {
        title: "Post 3",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat urna vel ante volutpat, ut elementum mi placerat. Phasellus varius nisi a nisl interdum, at ultrices ex tincidunt. Duis nec nunc vel urna ullamcorper eleifend ac id dolor. Phasellus vitae tortor ac metus laoreet rutrum. Aenean condimentum consequat elit, ut placerat massa mattis vitae. Vivamus dictum faucibus massa, eget euismod turpis pretium a. Aliquam rutrum rhoncus mi, eu tincidunt mauris placerat nec. Nunc sagittis libero sed facilisis suscipit. Curabitur nisi lacus, ullamcorper eu maximus quis, malesuada sit amet nisi. Proin dignissim, lacus vitae mattis fermentum, dui dolor feugiat turpis, ut euismod libero purus eget dui.",
        authorId: lee.id,
        categoryId: c1.id,
    },
  })
  

  const comment1 = await prisma.comment.create({
    data: {
      message: "I am a root comment",
      userId: lee.id,
      postId: post1.id,
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      parentId: comment1.id,
      message: "nested comments1",
      userId: lee.id,
      postId: post1.id,
    },
  })
  
  const comment3 = await prisma.comment.create({
    data: {
      parentId: comment2.id,
      message: "nested comments2",
      userId: lee.id,
      postId: post1.id,
    },
  })

  const comment4 = await prisma.comment.create({
    data: {
      message: "I am another root comment",
      userId: lee.id,
      postId: post1.id,
    },
  })
}

seed()