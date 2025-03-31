import { SeoRecommendation } from "@/types/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SeoRecommendationsProps {
  recommendations: SeoRecommendation[];
}

export function SeoRecommendations({ recommendations }: SeoRecommendationsProps) {
  // Filter recommendations by type
  const criticalIssues = recommendations.filter(rec => rec.type === 'critical');
  const moderateIssues = recommendations.filter(rec => rec.type === 'moderate');
  const suggestions = recommendations.filter(rec => rec.type === 'suggestion');

  return (
    <Card className="mt-8 shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">
          SEO Improvement Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {criticalIssues.length > 0 && (
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="text-sm font-medium text-gray-900">Critical Issues</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {criticalIssues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-red-500 text-sm mr-2 mt-0.5">priority_high</span>
                    <span>{issue.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {moderateIssues.length > 0 && (
            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <h4 className="text-sm font-medium text-gray-900">Moderate Issues</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {moderateIssues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-amber-500 text-sm mr-2 mt-0.5">warning</span>
                    <span>{issue.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="border-l-4 border-emerald-500 pl-4 py-2">
              <h4 className="text-sm font-medium text-gray-900">Suggested Improvements</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-emerald-500 text-sm mr-2 mt-0.5">lightbulb</span>
                    <span>{suggestion.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {recommendations.length === 0 && (
            <div className="text-center py-4">
              <span className="material-icons text-emerald-500 text-4xl mb-2">check_circle</span>
              <p className="text-gray-600">No recommendations needed. Your SEO is in great shape!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
