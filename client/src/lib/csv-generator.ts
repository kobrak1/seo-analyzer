import { SeoAnalysisReport } from "@/types/seo";

export function generateCsvReport(report: SeoAnalysisReport): void {
  try {
    // Create CSV content
    const rows: string[] = [];
    
    // Add header with basic information
    rows.push('SEO Analysis Report');
    rows.push(`Domain,${report.domain}`);
    rows.push(`URL,${report.url}`);
    rows.push(`Date,${report.timestamp}`);
    rows.push('');
    
    // Add scores section
    rows.push('Scores');
    rows.push('Category,Score,Maximum');
    rows.push(`Overall,${report.scores.overall},100`);
    rows.push(`Meta Tags,${report.scores.metaTags},100`);
    rows.push(`Content Structure,${report.scores.contentStructure},100`);
    rows.push(`Image Optimization,${report.scores.imageOptimization},100`);
    rows.push(`Page Speed,${report.scores.pageSpeed},100`);
    rows.push('');
    
    // Add meta tags section
    rows.push('Meta Tags');
    rows.push(`Title,${escapeCsvValue(report.metaTags.title)}`);
    rows.push(`Length,${report.metaTags.titleLength} characters`);
    rows.push(`Description,${escapeCsvValue(report.metaTags.description)}`);
    rows.push(`Length,${report.metaTags.descriptionLength} characters`);
    rows.push(`Keywords,${escapeCsvValue(report.metaTags.keywords.join(', '))}`);
    rows.push(`Canonical,${escapeCsvValue(report.metaTags.canonical)}`);
    rows.push('');
    
    // Add headings section
    rows.push('Heading Structure');
    rows.push('Type,Content,Status');
    report.headings.forEach(heading => {
      rows.push(`${heading.type},${escapeCsvValue(heading.content)},${heading.status}`);
    });
    rows.push('');
    
    // Add images section
    rows.push('Images');
    rows.push('Image,Alt Text,Status');
    report.images.forEach(image => {
      rows.push(`${escapeCsvValue(image.src)},${escapeCsvValue(image.alt)},${image.status}`);
    });
    rows.push('');
    
    // Add keywords section
    rows.push('Keywords');
    rows.push('Keyword,Density,Status');
    report.keywords.forEach(keyword => {
      rows.push(`${escapeCsvValue(keyword.keyword)},${keyword.density}%,${keyword.status}`);
    });
    rows.push('');
    
    // Add URL analysis section
    rows.push('URL Analysis');
    rows.push(`Length,${report.urlAnalysis.length} characters`);
    rows.push(`Contains Underscores,${report.urlAnalysis.containsUnderscores ? 'Yes' : 'No'}`);
    rows.push(`HTTPS Enabled,${report.urlAnalysis.httpsEnabled ? 'Yes' : 'No'}`);
    rows.push(`Mobile Friendly,${report.urlAnalysis.mobileFriendly ? 'Yes' : 'No'}`);
    rows.push(`WWW Redirect,${escapeCsvValue(report.urlAnalysis.wwwRedirect)}`);
    rows.push('');
    
    // Add page speed section
    rows.push('Page Speed');
    rows.push(`Desktop Speed,${report.pageSpeed.desktopSpeed}/100`);
    rows.push(`Mobile Speed,${report.pageSpeed.mobileSpeed}/100`);
    rows.push('');
    
    // Add critical issues
    rows.push('Critical Issues');
    if (report.pageSpeed.issues.critical.length > 0) {
      report.pageSpeed.issues.critical.forEach(issue => {
        rows.push(escapeCsvValue(issue));
      });
    } else {
      rows.push('None');
    }
    rows.push('');
    
    // Add moderate issues
    rows.push('Moderate Issues');
    if (report.pageSpeed.issues.moderate.length > 0) {
      report.pageSpeed.issues.moderate.forEach(issue => {
        rows.push(escapeCsvValue(issue));
      });
    } else {
      rows.push('None');
    }
    rows.push('');
    
    // Add recommendations section
    rows.push('SEO Recommendations');
    rows.push('Type,Recommendation');
    report.recommendations.forEach(rec => {
      rows.push(`${rec.type},${escapeCsvValue(rec.message)}`);
    });
    
    // Join rows with newlines to create CSV content
    const csvContent = rows.join('\r\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SEO_Report_${report.domain}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Error generating CSV report:', error);
    throw new Error('Failed to generate CSV report');
  }
}

// Helper function to escape CSV values
function escapeCsvValue(value: string): string {
  if (!value) return '';
  
  // If the value contains a comma, newline, or double quote, wrap it in double quotes
  if (/[",\n]/.test(value)) {
    // Replace double quotes with two double quotes
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
