export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
