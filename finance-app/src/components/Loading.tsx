

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      
      {/* SPINNER */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>

        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>

      {/* TEXT */}
      <p className="mt-3 text-gray-500 text-sm animate-pulse">
        {text}
      </p>
    </div>
  );
}