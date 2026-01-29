
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center min-h-[400px] gap-6">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-muted/30"></div>
        {/* Spinning Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">
        로딩 중...
      </p>
    </div>
  )
}

export default LoadingSpinner;