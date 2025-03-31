export interface SeoAnalysisRequest {
  url: string;
}

export interface SeoScores {
  overall: number;
  metaTags: number;
  contentStructure: number;
  pageSpeed: number;
  imageOptimization: number;
}

export interface MetaTagsData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  titleLength: number;
  descriptionLength: number;
}

export interface HeadingData {
  type: string;
  content: string;
  status: 'Good' | 'Warning' | 'Error';
  message?: string;
}

export interface ImageData {
  src: string;
  alt: string;
  status: 'Descriptive' | 'Too generic' | 'Missing';
}

export interface KeywordData {
  keyword: string;
  density: number;
  status: 'Good' | 'Over-optimized' | 'Under-optimized';
}

export interface UrlAnalysisData {
  length: number;
  containsUnderscores: boolean;
  httpsEnabled: boolean;
  mobileFriendly: boolean;
  wwwRedirect: string;
}

export interface PageSpeedData {
  desktopSpeed: number;
  mobileSpeed: number;
  issues: {
    critical: string[];
    moderate: string[];
  };
}

export interface SeoRecommendation {
  type: 'critical' | 'moderate' | 'suggestion';
  message: string;
}

export interface SeoAnalysisReport {
  url: string;
  domain: string;
  timestamp: string;
  scores: SeoScores;
  metaTags: MetaTagsData;
  headings: HeadingData[];
  images: ImageData[];
  keywords: KeywordData[];
  urlAnalysis: UrlAnalysisData;
  pageSpeed: PageSpeedData;
  recommendations: SeoRecommendation[];
}
