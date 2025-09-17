import { relations, sql } from 'drizzle-orm';
import { index, pgTableCreator, primaryKey, unique } from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(name => `alt1-plugin-hub_${name}`);

export const plugins = createTable('plugins', d => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 255 }),
    appConfig: d.text(),
    readMe: d.text(),
    category: d.text().array(),
    status: d.varchar({ length: 255 }),
    disabled: d.boolean(),
    createdById: d
        .varchar({ length: 255 })
        .notNull()
        .references(() => users.id),
    createdAt: d
        .timestamp({ withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const comments = createTable('comments', d => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    message: d.text(),
    pluginId: d
        .integer()
        .notNull()
        .references(() => plugins.id),
    createdById: d
        .varchar({ length: 255 })
        .notNull()
        .references(() => users.id),
    createdAt: d
        .timestamp({ withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const votes = createTable(
    'votes',
    d => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        createdById: d
            .varchar({ length: 255 })
            .notNull()
            .references(() => users.id),
        pluginId: d
            .integer()
            .notNull()
            .references(() => plugins.id),
        createdAt: d
            .timestamp({ withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        value: d.smallint().notNull(), // +1 for upvote, -1 for downvote
    }),
    table => [unique('userPluginUnique_votes').on(table.createdById, table.pluginId)]
);

export const pluginMetadata = createTable(
    'metadata',
    d => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        createdById: d
            .varchar({ length: 255 })
            .notNull()
            .references(() => users.id),
        pluginId: d
            .integer()
            .notNull()
            .references(() => plugins.id),
        createdAt: d
            .timestamp({ withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        type: d.text(),
        name: d.text(),
        value: d.text(),
    }),
    table => [unique('userPluginUnique_meta').on(table.pluginId, table.name)]
);

export const users = createTable('user', d => ({
    id: d
        .varchar({ length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: d.varchar({ length: 255 }),
    email: d.varchar({ length: 255 }),
    emailVerified: d
        .timestamp({
            mode: 'date',
            withTimezone: true,
        })
        .default(sql`CURRENT_TIMESTAMP`),
    image: d.varchar({ length: 255 }),
    username: d.varchar({ length: 255 }),
    disabled: d.boolean(),
}));

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
}));

export const accounts = createTable(
    'account',
    d => ({
        userId: d
            .varchar({ length: 255 })
            .notNull()
            .references(() => users.id),
        type: d.varchar({ length: 255 }).$type<AdapterAccount['type']>().notNull(),
        provider: d.varchar({ length: 255 }).notNull(),
        providerAccountId: d.varchar({ length: 255 }).notNull(),
        refresh_token: d.text(),
        access_token: d.text(),
        expires_at: d.integer(),
        token_type: d.varchar({ length: 255 }),
        scope: d.varchar({ length: 255 }),
        id_token: d.text(),
        session_state: d.varchar({ length: 255 }),
    }),
    t => [primaryKey({ columns: [t.provider, t.providerAccountId] }), index('account_user_id_idx').on(t.userId)]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    'session',
    d => ({
        sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
        userId: d
            .varchar({ length: 255 })
            .notNull()
            .references(() => users.id),
        expires: d.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    }),
    t => [index('t_user_id_idx').on(t.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
    'verification_token',
    d => ({
        identifier: d.varchar({ length: 255 }).notNull(),
        token: d.varchar({ length: 255 }).notNull(),
        expires: d.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    }),
    t => [primaryKey({ columns: [t.identifier, t.token] })]
);
