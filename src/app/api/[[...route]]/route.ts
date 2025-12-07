import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/index';
import { brands, models, selections } from '@/db/schema';
import { eq } from 'drizzle-orm';

const app = new Hono().basePath('/api');

// Get Brands
app.get('/brands', async (c) => {
  const result = await db.select().from(brands);
  return c.json(result);
});

// Get Models by Brand
app.get('/models/:brandId', async (c) => {
  const brandId = Number(c.req.param('brandId'));
  
  if (isNaN(brandId)) {
    return c.json({ error: "ID de marque invalide" }, 400);
  }

  const result = await db.select().from(models).where(eq(models.brandId, brandId));
  return c.json(result);
});

// Save Selection
app.post('/selections', async (c) => {
  const body = await c.req.json();
  
  if (!body.brandName || !body.modelName) {
    return c.json({ error: "Marque ou modèle manquant" }, 400);
  }

  await db.insert(selections).values({
    brandName: body.brandName,
    modelName: body.modelName,
  });
  
  return c.json({ success: true });
});

export const GET = handle(app);
export const POST = handle(app);