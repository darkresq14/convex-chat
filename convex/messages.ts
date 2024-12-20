import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const sendMessage = mutation({
  args: {
    group_id: v.id('groups'),
    content: v.string(),
    user: v.string(),
    file: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', args);
  },
});

export const getForId = query({
  args: { chatId: v.id('groups') },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .filter((fb) => fb.eq(fb.field('group_id'), args.chatId))
      .collect();

    return await Promise.all(
      messages.map(async (m) => {
        const url = m.file ? await ctx.storage.getUrl(m.file) : null;

        return url ? { ...m, file: url } : m;
      })
    );
  },
});
