import { seoReports, type InsertSeoReport, type SeoReport } from "@shared/schema";
import { nanoid } from 'nanoid';

export interface IStorage {
  createSeoReport(report: InsertSeoReport): Promise<SeoReport>;
  getSeoReport(id: number): Promise<SeoReport | undefined>;
  getSeoReportByUrl(url: string): Promise<SeoReport | undefined>;
  getAllSeoReports(): Promise<SeoReport[]>;
}

export class MemStorage implements IStorage {
  private reports: Map<number, SeoReport>;
  private currentId: number;

  constructor() {
    this.reports = new Map();
    this.currentId = 1;
  }

  async createSeoReport(insertReport: InsertSeoReport): Promise<SeoReport> {
    const id = this.currentId++;
    const timestamp = new Date();
    const report: SeoReport = { 
      ...insertReport, 
      id,
      createdAt: timestamp
    };
    this.reports.set(id, report);
    return report;
  }

  async getSeoReport(id: number): Promise<SeoReport | undefined> {
    return this.reports.get(id);
  }

  async getSeoReportByUrl(url: string): Promise<SeoReport | undefined> {
    return Array.from(this.reports.values()).find(
      (report) => report.url === url,
    );
  }

  async getAllSeoReports(): Promise<SeoReport[]> {
    return Array.from(this.reports.values());
  }
}

export const storage = new MemStorage();
