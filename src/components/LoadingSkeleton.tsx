export function LoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="loading-skeleton rounded-[10px] mb-0.5"
          style={{ height: 100 }}
        />
      ))}
    </>
  );
}
