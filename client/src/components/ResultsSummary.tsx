import { Card } from "@/components/ui/card";
import { SeoAnalysisReport } from "@/types/seo";
import { DownloadButton } from "@/components/ui/download-button";
import { ScorePill } from "@/components/ui/score-pill";

interface ResultsSummaryProps {
  report: SeoAnalysisReport;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
}

export function ResultsSummary({ report, onDownloadPDF, onDownloadCSV }: ResultsSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{report.domain}</h2>
          <p className="mt-1 text-sm text-gray-500">Analyzed on {report.timestamp}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex space-x-3">
            <DownloadButton onClick={onDownloadPDF} icon="picture_as_pdf">
              PDF Report
            </DownloadButton>
            <DownloadButton onClick={onDownloadCSV} icon="table_view">
              CSV Export
            </DownloadButton>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Score */}
        <ScoreCard 
          title="Overall SEO Score" 
          score={report.scores.overall} 
        />
        
        {/* Meta Tags Score */}
        <ScoreCard 
          title="Meta Tags" 
          score={report.scores.metaTags} 
        />
        
        {/* Content Structure */}
        <ScoreCard 
          title="Content Structure" 
          score={report.scores.contentStructure} 
        />
        
        {/* Page Speed */}
        <ScoreCard 
          title="Page Speed" 
          score={report.scores.pageSpeed} 
        />
      </div>
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  score: number;
}

function ScoreCard({ title, score }: ScoreCardProps) {
  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="mt-1 flex justify-between items-center">
            <div className="text-3xl font-semibold text-gray-900">{score}/100</div>
            <ScorePill score={score} />
          </dd>
        </dl>
      </div>
    </div>
  );
}
