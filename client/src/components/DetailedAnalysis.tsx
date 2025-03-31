import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScorePill } from "@/components/ui/score-pill";
import { SeoAnalysisReport } from "@/types/seo";
import { KeywordChart } from "@/components/KeywordChart";

interface DetailedAnalysisProps {
  report: SeoAnalysisReport;
}

export function DetailedAnalysis({ report }: DetailedAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column - Meta info and structure */}
      <div className="lg:col-span-2 space-y-8">
        {/* Meta Tags Analysis */}
        <MetaTagsAnalysis report={report} />

        {/* Heading Structure Analysis */}
        <HeadingStructureAnalysis report={report} />

        {/* Image Alt Text Analysis */}
        <ImageAnalysis report={report} />
      </div>

      {/* Right column - Charts and other data */}
      <div className="space-y-8">
        {/* URL Structure Analysis */}
        <UrlAnalysis report={report} />

        {/* Keyword Density Chart */}
        <KeywordChart keywords={report.keywords} />

        {/* Page Speed */}
        <PageSpeedAnalysis report={report} />
      </div>
    </div>
  );
}

function MetaTagsAnalysis({ report }: { report: SeoAnalysisReport }) {
  return (
    <Card className="shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Meta Tags Analysis</h3>
        <ScorePill score={report.scores.metaTags} />
      </CardHeader>
      <CardContent className="p-6">
        <dl>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{report.metaTags.title}</dd>
              <div className="mt-2 flex items-center">
                <span className={`material-icons text-sm mr-1 ${report.metaTags.titleLength > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {report.metaTags.titleLength > 60 ? 'warning' : 'check_circle'}
                </span>
                <span className="text-xs text-gray-500">
                  {report.metaTags.titleLength > 60 
                    ? `Title is too long (${report.metaTags.titleLength} characters)`
                    : `Title length is optimal (${report.metaTags.titleLength} characters)`}
                </span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Meta Description</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{report.metaTags.description}</dd>
              <div className="mt-2 flex items-center">
                <span className={`material-icons text-sm mr-1 ${report.metaTags.descriptionLength > 155 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {report.metaTags.descriptionLength > 155 ? 'info' : 'check_circle'}
                </span>
                <span className="text-xs text-gray-500">
                  {report.metaTags.descriptionLength > 155 
                    ? `Description could be more concise (currently ${report.metaTags.descriptionLength} characters)`
                    : `Description length is optimal (${report.metaTags.descriptionLength} characters)`}
                </span>
              </div>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Keywords</dt>
              <dd className="mt-1">
                <div className="flex flex-wrap gap-2">
                  {report.metaTags.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {keyword}
                    </span>
                  ))}
                  {report.metaTags.keywords.length === 0 && (
                    <span className="text-sm text-gray-500">No keywords found</span>
                  )}
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Canonical URL</dt>
              <dd className="mt-1 text-sm text-gray-900">{report.metaTags.canonical || 'Not set'}</dd>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {report.recommendations
                .filter(rec => rec.message.toLowerCase().includes('meta') || rec.message.toLowerCase().includes('title') || rec.message.toLowerCase().includes('description'))
                .slice(0, 3)
                .map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`material-icons text-sm mr-2 mt-0.5 ${
                      rec.type === 'critical' ? 'text-red-500' :
                      rec.type === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {rec.type === 'critical' ? 'error' : 
                       rec.type === 'moderate' ? 'warning' : 'lightbulb'}
                    </span>
                    <span>{rec.message}</span>
                  </li>
                ))}
            </ul>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function HeadingStructureAnalysis({ report }: { report: SeoAnalysisReport }) {
  return (
    <Card className="shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Heading Structure</h3>
        <ScorePill score={report.scores.contentStructure} />
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.headings.map((heading, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{heading.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{heading.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      heading.status === 'Good' ? 'bg-green-100 text-green-800' :
                      heading.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <span className={`material-icons text-xs mr-1 ${
                        heading.status === 'Good' ? 'text-green-500' :
                        heading.status === 'Warning' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {heading.status === 'Good' ? 'check_circle' : 
                         heading.status === 'Warning' ? 'warning' : 'error'}
                      </span>
                      {heading.status}
                    </span>
                  </td>
                </tr>
              ))}
              {report.headings.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm text-gray-500 text-center">No headings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
          <ul className="mt-2 space-y-2 text-sm">
            {report.recommendations
              .filter(rec => rec.message.toLowerCase().includes('heading') || rec.message.toLowerCase().includes('h1') || rec.message.toLowerCase().includes('structure'))
              .slice(0, 2)
              .map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className={`material-icons text-sm mr-2 mt-0.5 ${
                    rec.type === 'critical' ? 'text-red-500' :
                    rec.type === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {rec.type === 'critical' ? 'error' : 
                     rec.type === 'moderate' ? 'warning' : 'lightbulb'}
                  </span>
                  <span>{rec.message}</span>
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageAnalysis({ report }: { report: SeoAnalysisReport }) {
  const totalImages = report.images.length;
  const missingAlt = report.images.filter(img => img.status === 'Missing').length;
  const descriptiveAlt = report.images.filter(img => img.status === 'Descriptive').length;
  
  const altTextPercentage = totalImages > 0 ? Math.round((descriptiveAlt / totalImages) * 100) : 100;
  
  return (
    <Card className="shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Image Optimization</h3>
        <ScorePill score={report.scores.imageOptimization} />
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Alt Text Usage</h4>
              <p className="mt-1 text-sm text-gray-500">
                {descriptiveAlt} out of {totalImages} images have proper alt text
              </p>
            </div>
            <div className="ml-4">
              <div className="relative pt-1 w-36">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                  <div 
                    style={{ width: `${altTextPercentage}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alt Text</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.images.map((image, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.src}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {image.alt ? `"${image.alt}"` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      image.status === 'Descriptive' ? 'bg-green-100 text-green-800' :
                      image.status === 'Too generic' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <span className={`material-icons text-xs mr-1 ${
                        image.status === 'Descriptive' ? 'text-green-500' :
                        image.status === 'Too generic' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {image.status === 'Descriptive' ? 'check_circle' : 
                         image.status === 'Too generic' ? 'warning' : 'error'}
                      </span>
                      {image.status}
                    </span>
                  </td>
                </tr>
              ))}
              {report.images.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm text-gray-500 text-center">No images found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
          <ul className="mt-2 space-y-2 text-sm">
            {report.recommendations
              .filter(rec => rec.message.toLowerCase().includes('image') || rec.message.toLowerCase().includes('alt text'))
              .slice(0, 2)
              .map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className={`material-icons text-sm mr-2 mt-0.5 ${
                    rec.type === 'critical' ? 'text-red-500' :
                    rec.type === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {rec.type === 'critical' ? 'error' : 
                     rec.type === 'moderate' ? 'warning' : 'lightbulb'}
                  </span>
                  <span>{rec.message}</span>
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function UrlAnalysis({ report }: { report: SeoAnalysisReport }) {
  return (
    <Card className="shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">URL Analysis</h3>
      </CardHeader>
      <CardContent className="p-6">
        <dl className="divide-y divide-gray-200">
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">URL Length</dt>
            <dd className="text-sm text-gray-900">
              {report.urlAnalysis.length} characters <span className={report.urlAnalysis.length < 100 ? "text-emerald-500" : "text-amber-500"}>
                ({report.urlAnalysis.length < 100 ? "Good" : "Too long"})
              </span>
            </dd>
          </div>
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Contains underscores</dt>
            <dd className="text-sm text-gray-900">
              {report.urlAnalysis.containsUnderscores ? "Yes" : "No"} <span className={!report.urlAnalysis.containsUnderscores ? "text-emerald-500" : "text-amber-500"}>
                ({!report.urlAnalysis.containsUnderscores ? "Good" : "Not recommended"})
              </span>
            </dd>
          </div>
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">HTTPS</dt>
            <dd className="text-sm text-gray-900">
              {report.urlAnalysis.httpsEnabled ? "Yes" : "No"} <span className={report.urlAnalysis.httpsEnabled ? "text-emerald-500" : "text-red-500"}>
                ({report.urlAnalysis.httpsEnabled ? "Good" : "Critical"})
              </span>
            </dd>
          </div>
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Mobile Friendly</dt>
            <dd className="text-sm text-gray-900">
              {report.urlAnalysis.mobileFriendly ? "Yes" : "No"} <span className={report.urlAnalysis.mobileFriendly ? "text-emerald-500" : "text-red-500"}>
                ({report.urlAnalysis.mobileFriendly ? "Good" : "Critical"})
              </span>
            </dd>
          </div>
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">WWW Redirect</dt>
            <dd className="text-sm text-gray-900">
              {report.urlAnalysis.wwwRedirect} <span className="text-emerald-500">(Good)</span>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function PageSpeedAnalysis({ report }: { report: SeoAnalysisReport }) {
  return (
    <Card className="shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Page Speed</h3>
        <ScorePill score={report.scores.pageSpeed} />
      </CardHeader>
      <CardContent className="p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500">Desktop Loading Time</dt>
            <dd className="mt-1">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {(10 - (report.pageSpeed.desktopSpeed / 10)).toFixed(1)}s
                </span>
                <span className={`ml-2 text-sm ${
                  report.pageSpeed.desktopSpeed >= 80 ? "text-emerald-500" :
                  report.pageSpeed.desktopSpeed >= 50 ? "text-amber-500" : "text-red-500"
                }`}>
                  {report.pageSpeed.desktopSpeed >= 80 ? "Fast" :
                   report.pageSpeed.desktopSpeed >= 50 ? "Moderate" : "Slow"}
                </span>
              </div>
            </dd>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500">Mobile Loading Time</dt>
            <dd className="mt-1">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {(10 - (report.pageSpeed.mobileSpeed / 10)).toFixed(1)}s
                </span>
                <span className={`ml-2 text-sm ${
                  report.pageSpeed.mobileSpeed >= 80 ? "text-emerald-500" :
                  report.pageSpeed.mobileSpeed >= 50 ? "text-amber-500" : "text-red-500"
                }`}>
                  {report.pageSpeed.mobileSpeed >= 80 ? "Fast" :
                   report.pageSpeed.mobileSpeed >= 50 ? "Moderate" : "Slow"}
                </span>
              </div>
            </dd>
          </div>
        </dl>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Issues Affecting Speed</h4>
          <ul className="mt-2 space-y-2">
            {report.pageSpeed.issues.critical.map((issue, index) => (
              <li key={`critical-${index}`} className="flex items-start py-2">
                <span className="material-icons text-red-500 text-sm mr-2 mt-0.5">error</span>
                <span className="text-sm">{issue}</span>
              </li>
            ))}
            {report.pageSpeed.issues.moderate.map((issue, index) => (
              <li key={`moderate-${index}`} className="flex items-start py-2">
                <span className="material-icons text-amber-500 text-sm mr-2 mt-0.5">warning</span>
                <span className="text-sm">{issue}</span>
              </li>
            ))}
            {report.pageSpeed.issues.critical.length === 0 && report.pageSpeed.issues.moderate.length === 0 && (
              <li className="flex items-start py-2">
                <span className="material-icons text-emerald-500 text-sm mr-2 mt-0.5">check_circle</span>
                <span className="text-sm">No major issues detected</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
