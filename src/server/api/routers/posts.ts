import type { User } from '@clerk/nextjs/dist/api'
import clerkClient from "@clerk/clerk-sdk-node";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type } from "os";

const FilterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImgUrl: user.profileImageUrl
  }
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query( async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    })

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorID),
      limit: 100,
    })

    console.log(users);
    
    return posts.map((post) => ({
      post,
      authorID: users.find((user) => user.id == post.authorID)
    }))
  }),
})
