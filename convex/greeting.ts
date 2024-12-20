import { action } from './_generated/server';
import { v } from 'convex/values';

export const getGreeting = action({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return `Welcome back, ${args.name}!`;
  },
});
