"use client";

export default function ActiveFilters({
  filters,
  setFilters,
}) {
  const activeFilters = [];

  Object.entries(filters).forEach(([key, values]) => {
  if (!Array.isArray(values)) return; // 👈 important fix

  values.forEach((value) => {
    activeFilters.push({
      key,
      value,
    });
  });
});

  const removeFilter = (
    filterKey,
    filterValue
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[
        filterKey
      ].filter(
        (item) => item !== filterValue
      ),
    }));
  };

  if (!activeFilters.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-[0.5vw]">

      {activeFilters.map(
        ({ key, value }) => (
          <div
            key={`${key}-${value}`}
            className="flex items-center gap-[0.4vw]  px-[0.75vw] py-[0.3vw]"
          >
            <span className="text-[14px] text-[#757575]">
              {value}
            </span>

            <button
              onClick={() =>
                removeFilter(
                  key,
                  value
                )
              }
              className="flex h-[13px] w-[13px] items-center justify-center rounded-full text-[0.7vw] text-[#666] hover:text-red-500 leading-none"
            >
              ×
            </button>
          </div>
        )
      )}

    </div>
  );
}