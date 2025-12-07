import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export type Brand = { id: number; name: string };
export type Model = { id: number; name: string };


// Table Marques
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

// Table Modèles (Liée à Marque)
export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  brandId: integer('brand_id').references(() => brands.id).notNull(),
});

// Table Sélections
export const selections = pgTable('selections', {
  id: serial('id').primaryKey(),
  brandName: text('brand_name').notNull(), 
  modelName: text('model_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});