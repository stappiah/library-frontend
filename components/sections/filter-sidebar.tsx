"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FilterSidebarProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
}

const faculties = [
  {
    name: "All Faculties",
    value: "all",
    departments: [] as string[],
  },
  {
    name: "Faculty of Science",
    value: "science",
    departments: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"],
  },
  {
    name: "Faculty of Engineering",
    value: "engineering",
    departments: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Biomedical Engineering", "Chemical Engineering"],
  },
  {
    name: "Faculty of Business",
    value: "business",
    departments: ["Accounting", "Finance", "Marketing", "Management", "Economics"],
  },
  {
    name: "Faculty of Health Sciences",
    value: "health-sciences",
    departments: ["Nursing", "Pharmacy", "Public Health", "Nutrition"],
  },
  {
    name: "Faculty of Education",
    value: "education",
    departments: ["Early Childhood", "Special Education", "Curriculum Development"],
  },
  {
    name: "Faculty of Arts & Humanities",
    value: "arts-humanities",
    departments: ["English", "History", "Sociology", "Psychology", "Languages"],
  },
];

const priceOptions = ["All", "Under ₵100", "₵100 - ₵200", "₵200+"];

export function FilterSidebar({
  brands,
  selectedBrand,
  onBrandChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterSidebarProps) {
  const [expandedFaculty, setExpandedFaculty] = useState<string>(selectedCategory !== "all" ? selectedCategory : "");
  const [expandedBrands, setExpandedBrands] = useState(false);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Faculties Section */}
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Faculties</p>
        <div className="mt-4 space-y-1">
          {faculties.map((faculty) => (
            <div key={faculty.value}>
              <button
                type="button"
                onClick={() => {
                  onCategoryChange(faculty.value);
                  if (faculty.value !== "all") {
                    setExpandedFaculty(expandedFaculty === faculty.value ? "" : faculty.value);
                  } else {
                    setExpandedFaculty("");
                  }
                }}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm ${
                  selectedCategory === faculty.value
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-700 dark:text-zinc-200"
                }`}
              >
                <span>{faculty.name}</span>
                {faculty.value !== "all" && (
                  expandedFaculty === faculty.value 
                    ? <ChevronDown className="h-3 w-3" />
                    : <ChevronRight className="h-3 w-3" />
                )}
              </button>
              {/* Departments dropdown */}
              {faculty.value !== "all" && expandedFaculty === faculty.value && faculty.departments.length > 0 && (
                <div className="ml-3 mt-1 space-y-1 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => onCategoryChange(faculty.value)}
                    className={`block w-full rounded-xl px-3 py-1.5 text-left text-xs ${
                      selectedCategory === faculty.value
                        ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950"
                        : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    }`}
                  >
                    All Departments
                  </button>
                  {faculty.departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => onCategoryChange(`${faculty.value}-${dept.toLowerCase().replace(/\s+/g, "-")}`)}
                      className={`block w-full rounded-xl px-3 py-1.5 text-left text-xs ${
                        selectedCategory === `${faculty.value}-${dept.toLowerCase().replace(/\s+/g, "-")}`
                          ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950"
                          : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lecturers Section */}
      <div className="mt-8">
        <button
          type="button"
          onClick={() => setExpandedBrands(!expandedBrands)}
          className="flex w-full items-center justify-between"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Lecturers</p>
          {expandedBrands ? <ChevronDown className="h-3 w-3 text-zinc-500" /> : <ChevronRight className="h-3 w-3 text-zinc-500" />}
        </button>
        {expandedBrands && (
          <div className="mt-4 space-y-2">
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => onBrandChange(brand)}
                className={`block w-full rounded-2xl px-3 py-2 text-left text-sm ${
                  selectedBrand === brand
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-700 dark:text-zinc-200"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Price (GHS)</p>
        <div className="mt-4 space-y-2">
          {priceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPriceRangeChange(option)}
              className={`block w-full rounded-2xl px-3 py-2 text-left text-sm ${
                priceRange === option
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
