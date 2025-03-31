import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons text-primary text-3xl mr-2">travel_explore</span>
            <h1 className="text-xl font-bold text-gray-900">SEO Analyzer</h1>
          </div>
          <Button
            variant="default"
            onClick={() => window.open("https://github.com/readme.md", "_blank")}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            Documentation
          </Button>
        </div>
      </div>
    </header>
  );
}
