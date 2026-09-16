"use client";

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 py-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`text-center text-[24px] leading-[40px] tracking-[0.05em] font-medium transition-colors ${
              currentPage === page
                ? "text-black underline underline-offset-4"
                : "text-[#B6B6B6] hover:text-black"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() =>
          setCurrentPage((p) =>
            Math.min(p + 1, totalPages)
          )
        }
        disabled={currentPage === totalPages}
        className="text-[24px] leading-[40px] tracking-[0.05em] font-medium text-[#B6B6B6] hover:text-black transition-colors disabled:pointer-events-none disabled:opacity-50"
      >
        →
      </button>
    </div>
  );
}