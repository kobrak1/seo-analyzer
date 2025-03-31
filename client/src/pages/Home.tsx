import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { UrlInputForm } from "@/components/UrlInputForm";
import { ResultsSummary } from "@/components/ResultsSummary";
import { DetailedAnalysis } from "@/components/DetailedAnalysis";
import { SeoRecommendations } from "@/components/SeoRecommendations";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { SeoAnalysisReport } from "@/types/seo";
import { apiRequest } from "@/lib/queryClient";
import { generatePdfReport } from "@/lib/pdf-generator";
import { generateCsvReport } from "@/lib/csv-generator";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [analysisState, setAnalysisState] = useState<'initial' | 'loading' | 'error' | 'success'>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [report, setReport] = useState<SeoAnalysisReport | null>(null);
  const [loadingProgress, setLoadingProgress] = useState({
    percentage: 25,
    task: "Fetching page content..."
  });
  const { toast } = useToast();

  // Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/analyze', { url });
      return response.json();
    },
    onMutate: () => {
      setAnalysisState('loading');
      setErrorMessage('');
      
      // Simulate analysis progress
      let taskIndex = 0;
      const tasks = [
        { name: 'Fetching page content...', percent: 25 },
        { name: 'Analyzing meta tags...', percent: 40 },
        { name: 'Evaluating content structure...', percent: 60 },
        { name: 'Checking image optimization...', percent: 75 },
        { name: 'Calculating keyword density...', percent: 85 },
        { name: 'Measuring page speed...', percent: 95 },
        { name: 'Generating report...', percent: 100 }
      ];
      
      const interval = setInterval(() => {
        if (taskIndex < tasks.length) {
          setLoadingProgress({
            task: tasks[taskIndex].name,
            percentage: tasks[taskIndex].percent
          });
          taskIndex++;
        } else {
          clearInterval(interval);
        }
      }, 800);
      
      return () => clearInterval(interval);
    },
    onSuccess: (data: SeoAnalysisReport) => {
      setReport(data);
      setAnalysisState('success');
    },
    onError: (error: Error) => {
      setAnalysisState('error');
      setErrorMessage(error.message || 'Failed to analyze the website');
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || 'An error occurred during the analysis',
      });
    }
  });

  const handleAnalyze = (url: string) => {
    analysisMutation.mutate(url);
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    
    try {
      generatePdfReport(report);
      toast({
        title: "PDF generated",
        description: "Your PDF report has been downloaded",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "PDF generation failed",
        description: "There was an error generating your PDF report",
      });
    }
  };

  const handleDownloadCSV = () => {
    if (!report) return;
    
    try {
      generateCsvReport(report);
      toast({
        title: "CSV generated",
        description: "Your CSV report has been downloaded",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "CSV generation failed",
        description: "There was an error generating your CSV report",
      });
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Input Form */}
        <UrlInputForm 
          onSubmit={handleAnalyze} 
          isLoading={analysisState === 'loading'} 
        />
        
        {/* Initial state (before analysis) */}
        {analysisState === 'initial' && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 text-gray-400">
              <span className="material-icons text-7xl">search</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Enter a URL to begin your SEO analysis
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get comprehensive insights about your website's SEO performance
            </p>
          </div>
        )}
        
        {/* Loading state */}
        {analysisState === 'loading' && (
          <LoadingIndicator 
            currentTask={loadingProgress.task}
            percentage={loadingProgress.percentage}
          />
        )}
        
        {/* Error state */}
        {analysisState === 'error' && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 text-red-500">
              <span className="material-icons text-7xl">error_outline</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Unable to analyze website
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {errorMessage || "We couldn't fetch the website content. Please check the URL and try again."}
            </p>
            <button 
              onClick={() => setAnalysisState('initial')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Results view (after analysis) */}
        {analysisState === 'success' && report && (
          <div>
            {/* Results Summary */}
            <ResultsSummary 
              report={report} 
              onDownloadPDF={handleDownloadPDF}
              onDownloadCSV={handleDownloadCSV}
            />
            
            {/* Detailed Analysis */}
            <DetailedAnalysis report={report} />
            
            {/* Recommendations Summary */}
            <SeoRecommendations recommendations={report.recommendations} />
          </div>
        )}
      </main>
    </div>
  );
}
