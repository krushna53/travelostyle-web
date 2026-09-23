import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function StepOne({
  formData,
  updateField,
  toggleExperience,
  // [{ id, title, tagIds }] — real journeys fetched from Drupal (see
  // index.jsx), id is the plain node ID (drupal_internal__nid), tagIds
  // are that journey's field_journey_tag term ids. Populates the "Where
  // do you want to go?" option list.
  destinationOptions = [],
}) {
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [experiences, setExperiences] = useState([]);

  const filteredDestinations = useMemo(() => {
    const query = (formData.destination || "").trim().toLowerCase();
    if (!query) return destinationOptions;
    return destinationOptions.filter((d) =>
      d.title.toLowerCase().includes(query)
    );
  }, [destinationOptions, formData.destination]);

  const selectDestination = (option) => {
    updateField("destination", option.title);
    updateField("destinationId", option.id);
    updateField("journeyTypeIds", option.tagIds || []);
    setIsDestOpen(false);
  };

 useEffect(() => {
    fetch(`${API_BASE_URL}/jsonapi/taxonomy_term/travel_experiences`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch taxonomy terms from Drupal');
        }
        return res.json();
      })
      .then((data) => {
        const terms = data?.data?.map((item) => ({
          id: item.attributes.drupal_internal__tid, 
          name: item.attributes.name,
        }))
        setExperiences(terms);
      })
      .catch((err) => {
        console.error('Error fetching experiences:', err);
      });
  }, []);

  const renderCheckbox = (experience) => {
    const isChecked = formData.experiences?.includes(experience?.id);
    return (
      <label
        key={experience.id}
        className="inline-flex items-center gap-2 cursor-pointer select-none group"
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => toggleExperience(experience?.id)}
          className="h-[18px] w-[18px] shrink-0 rounded-[4px] border-[1.5px] border-[#1A1A1A] accent-[#2C3078] cursor-pointer"
        />
        <span className="text-[14px] font-[400] leading-[21px] tracking-[0.05em] text-[#1A1A1A] group-hover:text-[#000000] whitespace-nowrap">
          {experience?.name}
        </span>
      </label>
    );
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-[18px] font-[600] leading-[21px] tracking-[0.05em] text-[#1A1A1A]">
        What about the world are you ready to explore?
      </h3>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8">
        <div className="relative w-full sm:max-w-[360px]">
          <label className="block text-[16px] font-[500] leading-[32px] tracking-[0.05em] text-[#1A1A1A]">
            Where do you want to go?
          </label>

          <div className="flex items-center gap-2 border-b-[1.5px] border-[#1A1A1A] pb-1 pt-1">
            <Search size={16} strokeWidth={1.5} className="shrink-0 text-[#757575]" />
            <input
              type="text"
              value={formData.destination || ""}
              onChange={(e) => {
                updateField("destination", e.target.value);
                // Typing after a selection invalidates the previously
                // picked journey's id/tags — only a re-selection from the
                // list sets valid ones again.
                if (formData.destinationId) {
                  updateField("destinationId", null);
                  updateField("journeyTypeIds", []);
                }
                setIsDestOpen(true);
              }}
              onFocus={() => setIsDestOpen(true)}
              onBlur={() => setTimeout(() => setIsDestOpen(false), 150)}
              placeholder="Search your destination"
              autoComplete="off"
              className="w-full bg-transparent text-[14px] leading-tight tracking-[0.05em] text-[#1A1A1A] placeholder:text-[#757575] focus:outline-none"
            />
          </div>

          {isDestOpen && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[220px] overflow-y-auto rounded-[6px] border border-[#D9D9D9] bg-white shadow-lg">
              {filteredDestinations.length ? (
                filteredDestinations.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    // onMouseDown (not onClick) so the option is selected
                    // before the input's onBlur fires and closes the list.
                    onMouseDown={() => selectDestination(option)}
                    className="block w-full px-4 py-2 text-left text-[13px] tracking-[0.03em] text-[#1A1A1A] hover:bg-[#F2E5DE]"
                  >
                    {option.title}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-[13px] text-[#757575]">
                  No matching destinations
                </p>
              )}
            </div>
          )}
        </div>

        <p className="text-[13px] font-[400] leading-[21px] tracking-[0.05em] text-[#757575] sm:pb-0.5">
          Simply select a place you like, if there&apos;s a better option out
          there, we&apos;ll recommend it to you.
        </p>
      </div>
      <div className="mt-9">
        <label className="block text-[16px] font-[500] leading-[32px] tracking-[0.05em] text-[#1A1A1A]">
          What kind of experiences are you looking for?
        </label>

        <div className="mt-4 flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            {experiences.map(renderCheckbox)}
          </div>
        </div>
      </div>
    </div>
  );
}