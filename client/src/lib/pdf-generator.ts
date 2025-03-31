import { SeoAnalysisReport } from "@/types/seo";
import { getScoreStatus } from "@/components/ui/score-pill";

export async function generatePdfReport(report: SeoAnalysisReport): Promise<void> {
  try {
    // Dynamically import jspdf and jspdf-autotable
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);
    
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set report title
    doc.setFontSize(20);
    doc.text('SEO Analysis Report', 15, 15);
    
    // Add domain and timestamp info
    doc.setFontSize(12);
    doc.text(`Domain: ${report.domain}`, 15, 25);
    doc.text(`URL: ${report.url}`, 15, 32);
    doc.text(`Generated: ${report.timestamp}`, 15, 39);
    
    // Add overall score
    doc.setFontSize(16);
    doc.text('Overall SEO Score', 15, 50);
    
    // Add score with color
    const scoreStatus = getScoreStatus(report.scores.overall);
    const scoreColors = {
      good: [16, 185, 129], // emerald-500
      average: [245, 158, 11], // amber-500
      poor: [239, 68, 68], // red-500
    };
    
    doc.setFontSize(24);
    doc.setTextColor(...scoreColors[scoreStatus]);
    doc.text(`${report.scores.overall}/100`, 15, 60);
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // Add score breakdown
    doc.setFontSize(14);
    doc.text('Score Breakdown', 15, 75);
    
    autoTable(doc, {
      startY: 80,
      head: [['Category', 'Score', 'Status']],
      body: [
        ['Meta Tags', `${report.scores.metaTags}/100`, getScoreStatus(report.scores.metaTags).toUpperCase()],
        ['Content Structure', `${report.scores.contentStructure}/100`, getScoreStatus(report.scores.contentStructure).toUpperCase()],
        ['Image Optimization', `${report.scores.imageOptimization}/100`, getScoreStatus(report.scores.imageOptimization).toUpperCase()],
        ['Page Speed', `${report.scores.pageSpeed}/100`, getScoreStatus(report.scores.pageSpeed).toUpperCase()]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] } // primary blue
    });
    
    // Add meta tags section
    doc.setFontSize(14);
    doc.text('Meta Tags Analysis', 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Element', 'Content']],
      body: [
        ['Title', report.metaTags.title],
        ['Description', report.metaTags.description],
        ['Keywords', report.metaTags.keywords.join(', ') || 'None'],
        ['Canonical', report.metaTags.canonical || 'None']
      ],
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 140 }
      },
      headStyles: { fillColor: [59, 130, 246] } // primary blue
    });
    
    // Add heading analysis
    doc.setFontSize(14);
    doc.text('Heading Structure', 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Type', 'Content', 'Status']],
      body: report.headings.map(h => [h.type, h.content, h.status]),
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 140 },
        2: { cellWidth: 30 }
      },
      headStyles: { fillColor: [59, 130, 246] } // primary blue
    });
    
    // Add new page for images and keywords
    doc.addPage();
    
    // Add image analysis
    doc.setFontSize(14);
    doc.text('Image Optimization', 15, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Image', 'Alt Text', 'Status']],
      body: report.images.map(img => [img.src, img.alt || 'None', img.status]),
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 100 },
        2: { cellWidth: 30 }
      },
      headStyles: { fillColor: [59, 130, 246] } // primary blue
    });
    
    // Add keyword analysis
    doc.setFontSize(14);
    doc.text('Keyword Analysis', 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Keyword', 'Density', 'Status']],
      body: report.keywords.map(k => [k.keyword, `${k.density}%`, k.status]),
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 }
      },
      headStyles: { fillColor: [59, 130, 246] } // primary blue
    });
    
    // Add recommendations on a new page
    doc.addPage();
    doc.setFontSize(16);
    doc.text('SEO Recommendations', 15, 15);
    
    // Critical issues
    const criticalIssues = report.recommendations.filter(r => r.type === 'critical');
    if (criticalIssues.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(239, 68, 68); // red-500
      doc.text('Critical Issues', 15, 25);
      doc.setTextColor(0, 0, 0); // Reset to black
      
      autoTable(doc, {
        startY: 30,
        body: criticalIssues.map(r => [r.message]),
        theme: 'plain',
        styles: { fontSize: 10 }
      });
    }
    
    // Moderate issues
    const moderateIssues = report.recommendations.filter(r => r.type === 'moderate');
    if (moderateIssues.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(245, 158, 11); // amber-500
      doc.text('Moderate Issues', 15, doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 25);
      doc.setTextColor(0, 0, 0); // Reset to black
      
      autoTable(doc, {
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 30,
        body: moderateIssues.map(r => [r.message]),
        theme: 'plain',
        styles: { fontSize: 10 }
      });
    }
    
    // Suggestions
    const suggestions = report.recommendations.filter(r => r.type === 'suggestion');
    if (suggestions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129); // emerald-500
      doc.text('Suggested Improvements', 15, doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 25);
      doc.setTextColor(0, 0, 0); // Reset to black
      
      autoTable(doc, {
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 30,
        body: suggestions.map(r => [r.message]),
        theme: 'plain',
        styles: { fontSize: 10 }
      });
    }
    
    // Add footer with generation info
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Generated by SEO Analyzer - Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save(`SEO_Report_${report.domain}_${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
}
