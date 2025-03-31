import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { SeoAnalysisInput } from '@shared/schema';

interface SeoAnalysisResult {
  url: string;
  domain: string;
  timestamp: string;
  scores: {
    overall: number;
    metaTags: number;
    contentStructure: number;
    pageSpeed: number;
    imageOptimization: number;
  };
  metaTags: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    titleLength: number;
    descriptionLength: number;
  };
  headings: Array<{
    type: string;
    content: string;
    status: 'Good' | 'Warning' | 'Error';
    message?: string;
  }>;
  images: Array<{
    src: string;
    alt: string;
    status: 'Descriptive' | 'Too generic' | 'Missing';
  }>;
  keywords: Array<{
    keyword: string;
    density: number;
    status: 'Good' | 'Over-optimized' | 'Under-optimized';
  }>;
  urlAnalysis: {
    length: number;
    containsUnderscores: boolean;
    httpsEnabled: boolean;
    mobileFriendly: boolean;
    wwwRedirect: string;
  };
  pageSpeed: {
    desktopSpeed: number;
    mobileSpeed: number;
    issues: {
      critical: string[];
      moderate: string[];
    };
  };
  recommendations: Array<{
    type: 'critical' | 'moderate' | 'suggestion';
    message: string;
  }>;
}

export async function analyzeSeo(input: SeoAnalysisInput): Promise<SeoAnalysisResult> {
  const { url } = input;
  
  try {
    // Fetch website content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0; +http://seoanalyzer.com)'
      },
      timeout: 30000
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Get domain
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    
    // Generate timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    // Analyze meta tags
    const metaTagsResult = analyzeMetaTags($);
    
    // Analyze headings
    const headingsResult = analyzeHeadings($);
    
    // Analyze images
    const imagesResult = analyzeImages($);
    
    // Analyze keywords
    const keywordsResult = analyzeKeywords($, html);
    
    // Analyze URL
    const urlAnalysisResult = analyzeUrl(url);
    
    // Estimate page speed (simplified)
    const pageSpeedResult = estimatePageSpeed($, html);
    
    // Calculate scores
    const scores = {
      metaTags: calculateMetaTagsScore(metaTagsResult),
      contentStructure: calculateContentStructureScore(headingsResult),
      imageOptimization: calculateImageOptimizationScore(imagesResult),
      pageSpeed: pageSpeedResult.desktopSpeed,
      overall: 0 // Will be calculated below
    };
    
    // Calculate overall score
    scores.overall = Math.round(
      (scores.metaTags + scores.contentStructure + scores.imageOptimization + scores.pageSpeed) / 4
    );
    
    // Generate recommendations
    const recommendations = generateRecommendations(
      metaTagsResult, 
      headingsResult, 
      imagesResult, 
      keywordsResult, 
      pageSpeedResult
    );
    
    return {
      url,
      domain,
      timestamp,
      scores,
      metaTags: metaTagsResult,
      headings: headingsResult,
      images: imagesResult,
      keywords: keywordsResult,
      urlAnalysis: urlAnalysisResult,
      pageSpeed: pageSpeedResult,
      recommendations
    };
  } catch (error) {
    throw new Error(`Failed to analyze URL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function analyzeMetaTags($: cheerio.CheerioAPI): SeoAnalysisResult['metaTags'] {
  const title = $('title').text() || '';
  const description = $('meta[name="description"]').attr('content') || '';
  
  // Extract keywords
  const keywordsContent = $('meta[name="keywords"]').attr('content') || '';
  const keywords = keywordsContent
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);
  
  // Get canonical URL
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  
  // Calculate lengths
  const titleLength = title.length;
  const descriptionLength = description.length;
  
  return {
    title,
    description,
    keywords,
    canonical,
    titleLength,
    descriptionLength
  };
}

function analyzeHeadings($: cheerio.CheerioAPI): SeoAnalysisResult['headings'] {
  const headings: SeoAnalysisResult['headings'] = [];
  const headingLevels = new Set<number>();
  
  // Analyze all headings (h1-h6)
  for (let i = 1; i <= 6; i++) {
    $(`h${i}`).each((_, element) => {
      const content = $(element).text().trim();
      headingLevels.add(i);
      
      let status: 'Good' | 'Warning' | 'Error' = 'Good';
      let message;
      
      // Check for issues (e.g., empty content, hierarchy problems)
      if (!content) {
        status = 'Error';
        message = 'Empty heading';
      } else if (i === 1 && $('h1').length > 1) {
        status = 'Warning';
        message = 'Multiple H1 headings (should have only one)';
      }
      
      headings.push({
        type: `H${i}`,
        content,
        status,
        message
      });
    });
  }
  
  // Check for heading hierarchy issues
  const levelArray = Array.from(headingLevels).sort();
  for (let i = 1; i < levelArray.length; i++) {
    if (levelArray[i] > levelArray[i-1] + 1) {
      // Find headings of this level and mark them
      headings.forEach(heading => {
        if (heading.type === `H${levelArray[i]}`) {
          heading.status = 'Warning';
          heading.message = `Skipped H${levelArray[i]-1} in hierarchy`;
        }
      });
    }
  }
  
  return headings;
}

function analyzeImages($: cheerio.CheerioAPI): SeoAnalysisResult['images'] {
  const images: SeoAnalysisResult['images'] = [];
  
  $('img').each((_, element) => {
    const src = $(element).attr('src') || '';
    const alt = $(element).attr('alt') || '';
    
    let status: 'Descriptive' | 'Too generic' | 'Missing';
    
    if (!alt) {
      status = 'Missing';
    } else if (alt.length < 10 || alt.includes('image') || alt.includes('picture') || alt.includes('icon')) {
      status = 'Too generic';
    } else {
      status = 'Descriptive';
    }
    
    // Extract filename from path
    const filename = src.split('/').pop() || src;
    
    images.push({
      src: filename,
      alt,
      status
    });
  });
  
  return images;
}

function analyzeKeywords($: cheerio.CheerioAPI, html: string): SeoAnalysisResult['keywords'] {
  // Extract text content
  const text = $('body').text().toLowerCase();
  const words = text.split(/\s+/)
    .map(word => word.replace(/[^\w\s]/g, ''))
    .filter(word => word.length > 3);
  
  // Count word frequency
  const wordCounts: Record<string, number> = {};
  const totalWords = words.length;
  
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  // Calculate density for each word
  const keywordDensities = Object.entries(wordCounts)
    .map(([word, count]) => ({
      keyword: word,
      count,
      density: (count / totalWords) * 100
    }))
    .sort((a, b) => b.density - a.density)
    .slice(0, 10); // Top 10 keywords
  
  // Determine status based on density
  return keywordDensities.map(({ keyword, density }) => {
    let status: 'Good' | 'Over-optimized' | 'Under-optimized';
    
    if (density > 4) {
      status = 'Over-optimized';
    } else if (density < 0.5) {
      status = 'Under-optimized';
    } else {
      status = 'Good';
    }
    
    return {
      keyword,
      density: parseFloat(density.toFixed(1)),
      status
    };
  });
}

function analyzeUrl(url: string): SeoAnalysisResult['urlAnalysis'] {
  const parsedUrl = new URL(url);
  
  return {
    length: url.length,
    containsUnderscores: url.includes('_'),
    httpsEnabled: parsedUrl.protocol === 'https:',
    mobileFriendly: true, // Simplified assumption
    wwwRedirect: 'Properly configured' // Simplified assumption
  };
}

function estimatePageSpeed($: cheerio.CheerioAPI, html: string): SeoAnalysisResult['pageSpeed'] {
  const htmlSize = html.length;
  const imageCount = $('img').length;
  const scriptCount = $('script').length;
  const cssCount = $('link[rel="stylesheet"]').length;
  
  // Simplified estimation based on page complexity
  const complexityScore = Math.min(100, Math.max(0, 100 - (
    (htmlSize / 1024 / 10) + // Each 10KB reduces score
    (imageCount * 3) +        // Each image reduces score by 3
    (scriptCount * 5) +       // Each script reduces score by 5
    (cssCount * 2)            // Each CSS file reduces score by 2
  )));
  
  // Mobile is typically slower than desktop
  const desktopSpeed = Math.round(complexityScore);
  const mobileSpeed = Math.max(0, Math.round(desktopSpeed * 0.7));
  
  // Identify issues
  const issues = {
    critical: [] as string[],
    moderate: [] as string[]
  };
  
  if (imageCount > 10) {
    issues.critical.push('Too many images (more than 10)');
  }
  
  if (scriptCount > 5) {
    issues.critical.push(`Render-blocking JavaScript (${scriptCount} scripts)`);
  }
  
  if (htmlSize > 100 * 1024) {
    issues.moderate.push('Large HTML document size');
  }
  
  if (!$('head link[rel="preload"]').length) {
    issues.moderate.push('No preloaded resources');
  }
  
  if (!$('meta[name="viewport"]').length) {
    issues.moderate.push('Missing viewport meta tag');
  }
  
  return {
    desktopSpeed,
    mobileSpeed,
    issues
  };
}

function calculateMetaTagsScore(metaTags: SeoAnalysisResult['metaTags']): number {
  let score = 100;
  
  // Title checks
  if (!metaTags.title) {
    score -= 30;
  } else {
    if (metaTags.titleLength < 30) score -= 10;
    if (metaTags.titleLength > 60) score -= 5;
  }
  
  // Description checks
  if (!metaTags.description) {
    score -= 25;
  } else {
    if (metaTags.descriptionLength < 70) score -= 10;
    if (metaTags.descriptionLength > 160) score -= 5;
  }
  
  // Keywords check
  if (metaTags.keywords.length === 0) {
    score -= 10;
  }
  
  // Canonical check
  if (!metaTags.canonical) {
    score -= 5;
  }
  
  return Math.max(0, score);
}

function calculateContentStructureScore(headings: SeoAnalysisResult['headings']): number {
  let score = 100;
  
  // Check if there's an H1
  const hasH1 = headings.some(h => h.type === 'H1');
  if (!hasH1) {
    score -= 30;
  }
  
  // Check for multiple H1s
  const h1Count = headings.filter(h => h.type === 'H1').length;
  if (h1Count > 1) {
    score -= 15;
  }
  
  // Check for heading hierarchy issues
  const warningHeadings = headings.filter(h => h.status === 'Warning');
  score -= warningHeadings.length * 5;
  
  // Check for error headings
  const errorHeadings = headings.filter(h => h.status === 'Error');
  score -= errorHeadings.length * 10;
  
  // Check heading count
  if (headings.length < 3) {
    score -= 20;
  }
  
  return Math.max(0, score);
}

function calculateImageOptimizationScore(images: SeoAnalysisResult['images']): number {
  if (images.length === 0) return 100; // No images, no issues
  
  let score = 100;
  
  // Count issues
  const missingAlt = images.filter(img => img.status === 'Missing').length;
  const genericAlt = images.filter(img => img.status === 'Too generic').length;
  
  // Calculate percentage of issues
  const missingPercent = (missingAlt / images.length) * 100;
  const genericPercent = (genericAlt / images.length) * 100;
  
  // Reduce score based on issue percentages
  score -= missingPercent * 0.7;  // More penalty for missing alt text
  score -= genericPercent * 0.3;  // Less penalty for generic alt text
  
  return Math.round(Math.max(0, score));
}

function generateRecommendations(
  metaTags: SeoAnalysisResult['metaTags'],
  headings: SeoAnalysisResult['headings'],
  images: SeoAnalysisResult['images'],
  keywords: SeoAnalysisResult['keywords'],
  pageSpeed: SeoAnalysisResult['pageSpeed']
): SeoAnalysisResult['recommendations'] {
  const recommendations: SeoAnalysisResult['recommendations'] = [];
  
  // Meta tags recommendations
  if (!metaTags.title) {
    recommendations.push({
      type: 'critical',
      message: 'Add a title tag to your page'
    });
  } else if (metaTags.titleLength > 60) {
    recommendations.push({
      type: 'moderate',
      message: `Shorten your title tag to less than 60 characters (currently ${metaTags.titleLength})`
    });
  }
  
  if (!metaTags.description) {
    recommendations.push({
      type: 'critical',
      message: 'Add a meta description to your page'
    });
  } else if (metaTags.descriptionLength > 160) {
    recommendations.push({
      type: 'moderate',
      message: `Shorten your meta description to 120-155 characters (currently ${metaTags.descriptionLength})`
    });
  }
  
  // Heading recommendations
  const h1Count = headings.filter(h => h.type === 'H1').length;
  if (h1Count === 0) {
    recommendations.push({
      type: 'critical',
      message: 'Add an H1 heading to your page'
    });
  } else if (h1Count > 1) {
    recommendations.push({
      type: 'moderate',
      message: 'Use only one H1 heading per page'
    });
  }
  
  // Check for hierarchy issues
  const hierarchyIssues = headings.filter(h => h.status === 'Warning' && h.message?.includes('Skipped'));
  if (hierarchyIssues.length > 0) {
    recommendations.push({
      type: 'moderate',
      message: 'Fix heading hierarchy issues (avoid skipping heading levels)'
    });
  }
  
  // Image recommendations
  const missingAltImages = images.filter(img => img.status === 'Missing');
  if (missingAltImages.length > 0) {
    recommendations.push({
      type: 'critical',
      message: `Add alt text to ${missingAltImages.length} image${missingAltImages.length > 1 ? 's' : ''} that ${missingAltImages.length > 1 ? 'are' : 'is'} missing it`
    });
  }
  
  const genericAltImages = images.filter(img => img.status === 'Too generic');
  if (genericAltImages.length > 0) {
    recommendations.push({
      type: 'moderate',
      message: 'Make generic alt texts more descriptive'
    });
  }
  
  // Keyword recommendations
  const overoptimizedKeywords = keywords.filter(k => k.status === 'Over-optimized');
  if (overoptimizedKeywords.length > 0) {
    recommendations.push({
      type: 'moderate',
      message: `Reduce keyword density for ${overoptimizedKeywords.map(k => `"${k.keyword}" (${k.density}%)`).join(', ')}`
    });
  }
  
  // Page speed recommendations
  if (pageSpeed.desktopSpeed < 50) {
    recommendations.push({
      type: 'critical',
      message: 'Improve page loading speed'
    });
  }
  
  pageSpeed.issues.critical.forEach(issue => {
    recommendations.push({
      type: 'critical',
      message: issue
    });
  });
  
  pageSpeed.issues.moderate.forEach(issue => {
    recommendations.push({
      type: 'moderate',
      message: issue
    });
  });
  
  // Additional suggestions
  recommendations.push({
    type: 'suggestion',
    message: 'Add Open Graph and Twitter Card meta tags for better social sharing'
  });
  
  recommendations.push({
    type: 'suggestion',
    message: 'Implement structured data (Schema.org) to enhance search results appearance'
  });
  
  return recommendations;
}
