import z from 'zod';
import { protectedProcedure } from '../trpc';

// RuneScape 3 Skills
const RS3Skills = [
    'Attack',
    'Constitution',
    'Strength',
    'Defence',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcutting',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblore',
    'Agility',
    'Thieving',
    'Slayer',
    'Farming',
    'Runecrafting',
    'Hunter',
    'Construction',
    'Summoning',
    'Dungeoneering',
    'Divination',
    'Invention',
    'Archaeology',
] as const;

// Other plugin categories
const OtherCategories = [
    'Combat',
    'Quests & Achievements',
    'D&D (Distractions & Diversions)',
    'Minigames',
    'Bossing / PvM',
    'Clue Scrolls & Treasure Hunter',
    'Merching / GE',
    'Map & Navigation',
    'Events & Seasonal',
    'Lore & Collections',
    'Clan Tools',
    'Friends & Groups',
    'Chat & Communication',
    'UI / HUD',
    'Timers & Alerts',
    'Inventory & Bank',
    'Performance & Tech',
    'Cosmetic / Fun',
    'Accessibility',
    'Developer / Debug',
] as const;

const allCategories = [...RS3Skills, ...OtherCategories] as const;

// Full union ,
export const PluginCategory = z.enum(allCategories);

const createPluginSchema = z.object({
    name: z.string(),
    appConfig: z.string().url(),
    readMe: z.string().url(),
    metadata: z.array(
        z.object({
            type: z.union([z.literal('Support'), z.literal('Info')]),
            name: z.string(),
            value: z.string(),
        })
    ),
    category: z.set(PluginCategory),
    status: z.union([z.literal('In Development'), z.literal('Published')]),
});

export const createPlugin = protectedProcedure.input(createPluginSchema).mutation(async ({ ctx }) => {
    // console.log(ctx.headers, ctx.session)
    return;
});
