interface ModeSelectorProps {
  mode: 'database' | 'sample';
  questionCount: number;
  onModeChange: (mode: 'database' | 'sample') => void;
  onQuestionCountChange: (count: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  totalQuestions?: number;
}

export const ModeSelector = ({
  mode,
  questionCount,
  onModeChange,
  onQuestionCountChange,
  onAnalyze,
  isAnalyzing,
  totalQuestions = 0
}: ModeSelectorProps) => {

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Mode</h3>
      
      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => onModeChange('database')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            mode === 'database'
              ? 'text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={mode === 'database' ? { backgroundColor: '#3a5a40' } : {}}
        >
          <div className="text-sm font-semibold">Database Overview</div>
          <div className="text-xs opacity-90 mt-1">All available questions</div>
        </button>
        <button
          onClick={() => onModeChange('sample')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            mode === 'sample'
              ? 'text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={mode === 'sample' ? { backgroundColor: '#3a5a40' } : {}}
        >
          <div className="text-sm font-semibold">Sample Analysis</div>
          <div className="text-xs opacity-90 mt-1">Fetch & analyze questions</div>
        </button>
      </div>

      {/* Sample Mode Controls */}
      {mode === 'sample' && (
        <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#f4f3ee' }}>
          {/* Question Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Number of Questions
              </label>
              <span className="text-lg font-bold" style={{ color: '#3a5a40' }}>
                {questionCount}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => onQuestionCountChange(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3a5a40 0%, #3a5a40 ${((questionCount - 10) / 40) * 100}%, #d1d5db ${((questionCount - 10) / 40) * 100}%, #d1d5db 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>50 (API max)</span>
            </div>
          </div>

          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full px-4 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: '#3a5a40' }}
          >
            {isAnalyzing ? 'Analyzing...' : `Analyze ${questionCount} Questions`}
          </button>

          <div className="text-xs text-gray-600 text-center">
            <p className="font-medium" style={{ color: '#3a5a40' }}>✓ Max 50 questions per request (API limit)</p>
            <p className="mt-1">Fetches random questions and analyzes their distribution</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: '#8cb36910', borderColor: '#8cb369' }}>
        <p className="text-sm text-gray-700">
          {mode === 'database' ? (
            <>
              <span className="font-semibold">Current:</span> Showing complete database statistics ({totalQuestions.toLocaleString()} questions)
            </>
          ) : (
            <>
              <span className="font-semibold">Sample Mode:</span> Fetch and analyze a specific number of random questions
            </>
          )}
        </p>
      </div>
    </div>
  );
};
