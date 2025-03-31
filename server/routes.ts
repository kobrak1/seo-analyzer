import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeo } from "./seo-analyzer";
import { seoAnalysisInputSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for SEO analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the request input
      const validatedInput = seoAnalysisInputSchema.parse(req.body);
      
      // Perform SEO analysis
      const analysisResult = await analyzeSeo(validatedInput);
      
      // Create a report in storage
      const reportData = {
        url: analysisResult.url,
        domain: analysisResult.domain,
        overallScore: analysisResult.scores.overall,
        metaTagsScore: analysisResult.scores.metaTags,
        contentStructureScore: analysisResult.scores.contentStructure,
        imageOptimizationScore: analysisResult.scores.imageOptimization,
        pageSpeedScore: analysisResult.scores.pageSpeed,
        reportData: analysisResult
      };
      
      const savedReport = await storage.createSeoReport(reportData);
      
      // Return the analysis result
      return res.status(200).json(analysisResult);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("SEO Analysis error:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze the website" 
      });
    }
  });

  // API route to get a specific report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const report = await storage.getSeoReport(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      return res.status(200).json(report);
    } catch (error) {
      console.error("Get report error:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get the report" 
      });
    }
  });

  // API route to get all reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllSeoReports();
      return res.status(200).json(reports);
    } catch (error) {
      console.error("Get all reports error:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get reports" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
