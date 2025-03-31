import { useEffect, useRef } from "react";
import { KeywordData } from "@/types/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeywordChartProps {
  keywords: KeywordData[];
}

export function KeywordChart({ keywords }: KeywordChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || keywords.length === 0) return;
    
    // Use dynamic import to load Chart.js
    import('chart.js').then(({ Chart, registerables }) => {
      // Register all modules
      Chart.register(...registerables);
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Destroy previous chart instance if it exists
      const chartInstance = Chart.getChart(chartRef.current);
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      const keywordLabels = keywords.map(k => k.keyword);
      const densityValues = keywords.map(k => k.density);
      const backgroundColors = keywords.map(k => {
        if (k.status === 'Over-optimized') return 'rgba(245, 158, 11, 0.8)';
        if (k.status === 'Under-optimized') return 'rgba(107, 114, 128, 0.8)';
        return 'rgba(16, 185, 129, 0.8)';
      });
      
      // Create chart
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: keywordLabels,
          datasets: [{
            label: 'Keyword Density (%)',
            data: densityValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Density (%)'
              },
              suggestedMax: 6
            },
            x: {
              title: {
                display: true,
                text: 'Keywords'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                afterLabel: function(context) {
                  const value = context.parsed.y;
                  if (value > 4) return 'Overused - consider reducing';
                  if (value < 0.5) return 'Underused - consider increasing';
                  return 'Good density';
                }
              }
            }
          }
        }
      });
    });
  }, [keywords]);
  
  return (
    <Card>
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">Keyword Density</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="chart-container" style={{ height: "200px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Top Keywords</h4>
          <ul className="mt-2 divide-y divide-gray-200">
            {keywords.slice(0, 5).map((keyword, index) => (
              <li key={index} className="py-3 flex justify-between">
                <span className="text-sm text-gray-900">{keyword.keyword}</span>
                <span className="text-sm text-gray-500">
                  {keyword.density}% 
                  <span className={
                    keyword.status === 'Good' ? 'text-emerald-500 ml-1' : 
                    keyword.status === 'Over-optimized' ? 'text-amber-500 ml-1' : 
                    'text-gray-500 ml-1'
                  }>
                    ({keyword.status === 'Good' ? 'Good' : 
                      keyword.status === 'Over-optimized' ? 'Over-optimized' : 
                      'Under-optimized'})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
