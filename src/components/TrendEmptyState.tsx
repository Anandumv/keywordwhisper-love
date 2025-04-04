
const TrendEmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
      <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">No Trend Selected</h3>
        <p className="text-gray-600">Select a trend from the sidebar to view details</p>
      </div>
    </div>
  );
};

export default TrendEmptyState;
