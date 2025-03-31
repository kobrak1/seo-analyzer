import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from original file - keeping for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Report schema
export const seoReports = pgTable("seo_reports", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  overallScore: integer("overall_score").notNull(),
  metaTagsScore: integer("meta_tags_score").notNull(),
  contentStructureScore: integer("content_structure_score").notNull(),
  imageOptimizationScore: integer("image_optimization_score").notNull(),
  pageSpeedScore: integer("page_speed_score").notNull(),
  reportData: json("report_data").notNull(),
});

export const insertSeoReportSchema = createInsertSchema(seoReports).omit({
  id: true,
  createdAt: true,
});

export type InsertSeoReport = z.infer<typeof insertSeoReportSchema>;
export type SeoReport = typeof seoReports.$inferSelect;

// SEO Analysis Input schema
export const seoAnalysisInputSchema = z.object({
  url: z.string().url("Please enter a valid URL including http:// or https://"),
});

export type SeoAnalysisInput = z.infer<typeof seoAnalysisInputSchema>;
