import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('groups').collect();
  },
});

export const getById = query({
  args: { id: v.id('groups') },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query('groups')
      .filter((fb) => fb.eq(fb.field('_id'), id))
      .unique();
  },
});

export const create = mutation({
  args: { name: v.string(), description: v.string(), icon_url: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('groups', args);
  },
});
