const Loader = () => (
  <div className="flex flex-col justify-center items-center py-24 gap-4">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-4 border-muted" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary-glow animate-spin" />
    </div>
    <p className="text-sm text-muted-foreground animate-pulse">Finding the best pros…</p>
  </div>
);

export default Loader;
