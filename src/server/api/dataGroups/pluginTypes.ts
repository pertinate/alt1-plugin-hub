import z from 'zod';

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

export const MetaSupportSchema = z.object({
    id: z.number().optional(),
    type: z.literal('Support'),
    value: z.string().url().url({ message: 'Must be a valid URL' }), // value must be a valid URL when type is "Support"
    name: z.string(),
});

export const MetaInfoSchema = z.object({
    id: z.number().optional(),
    type: z.literal('Info'),
    value: z.string(), // any string when type is "Info"
    name: z.string(),
});

export const MetadataSchema = z.discriminatedUnion('type', [MetaSupportSchema, MetaInfoSchema]);

export const pluginSchema = z.object({
    name: z.string(),
    appConfig: z.string().url().url({ message: 'Must be a valid URL' }),
    readMe: z.string().url().url({ message: 'Must be a valid URL' }),
    metadata: z.array(MetadataSchema).max(15).min(0),
    category: z.array(PluginCategory).max(10).min(0),
    status: z.union([z.literal('In Development'), z.literal('Published')]),
});

export const updatePluginSchema = pluginSchema.extend({
    id: z.number(),
    category: z.array(PluginCategory),
});
