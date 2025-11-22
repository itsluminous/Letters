'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { PapyrusSelect, PapyrusDatePicker, PapyrusButton } from '@/components/ui';
import { Contact, LetterFilters } from '@/lib/supabase/types';

export interface FilterPanelProps {
  contacts: Contact[];
  filters: LetterFilters;
  onFilterChange: (filters: LetterFilters) => void;
  className?: string;
}

/**
 * FilterPanel component for filtering letters by contacts and date ranges
 * 
 * Provides multi-select contact dropdown and date range pickers with papyrus styling
 * On mobile, displays as a collapsible drawer
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  contacts,
  filters,
  onFilterChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleContactChange = (value: string | string[]) => {
    const contactIds = Array.isArray(value) ? value : [value];
    onFilterChange({
      ...filters,
      contactIds,
    });
  };

  const handleBeforeDateChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      beforeDate: date,
    });
  };

  const handleAfterDateChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      afterDate: date,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      contactIds: [],
      beforeDate: null,
      afterDate: null,
    });
  };

  const hasActiveFilters =
    filters.contactIds.length > 0 ||
    filters.beforeDate !== null ||
    filters.afterDate !== null;

  const contactOptions = contacts.map((contact) => ({
    value: contact.contactUserId,
    label: contact.displayName,
  }));

  const FilterContent = () => (
    <>
      <div className="space-y-4">
        {/* Contact Filter */}
        <PapyrusSelect
          label="Filter by Contact"
          options={contactOptions}
          value={filters.contactIds}
          onChange={handleContactChange}
          placeholder="All contacts"
          multiple
        />

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PapyrusDatePicker
            label="Letters Before"
            value={filters.beforeDate}
            onChange={handleBeforeDateChange}
            placeholder="No end date"
          />

          <PapyrusDatePicker
            label="Letters After"
            value={filters.afterDate}
            onChange={handleAfterDateChange}
            placeholder="No start date"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-papyrus-border">
          <p className="text-sm font-body text-papyrus-text-light">
            Active filters:{' '}
            {filters.contactIds.length > 0 && (
              <span className="font-semibold">
                {filters.contactIds.length} contact
                {filters.contactIds.length !== 1 ? 's' : ''}
              </span>
            )}
            {filters.contactIds.length > 0 &&
              (filters.beforeDate || filters.afterDate) &&
              ', '}
            {filters.beforeDate && (
              <span className="font-semibold">
                before {filters.beforeDate.toLocaleDateString()}
              </span>
            )}
            {filters.beforeDate && filters.afterDate && ', '}
            {filters.afterDate && (
              <span className="font-semibold">
                after {filters.afterDate.toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile: Filter button and drawer */}
      <div className="md:hidden">
        {/* Filter toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between',
            'bg-papyrus-dark border-2 border-papyrus-border',
            'papyrus-texture papyrus-shadow',
            'px-4 py-3',
            'font-heading text-papyrus-text',
            'hover:bg-papyrus-darker transition-colors',
            'min-h-[44px]', // Minimum touch target
            className
          )}
          aria-expanded={isOpen}
          aria-label="Toggle filters"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">
              Filters {hasActiveFilters && `(${filters.contactIds.length + (filters.beforeDate ? 1 : 0) + (filters.afterDate ? 1 : 0)})`}
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              'h-5 w-5 transition-transform',
              isOpen && 'rotate-180'
            )}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Collapsible drawer */}
        {isOpen && (
          <div className="bg-papyrus-bg border-x-2 border-b-2 border-papyrus-border papyrus-texture papyrus-shadow p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base font-semibold text-papyrus-text">
                Filter Letters
              </h3>
              {hasActiveFilters && (
                <PapyrusButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="min-h-[44px] min-w-[44px]"
                >
                  Clear All
                </PapyrusButton>
              )}
            </div>
            <FilterContent />
          </div>
        )}
      </div>

      {/* Desktop: Always visible panel */}
      <div
        className={cn(
          'hidden md:block',
          'bg-papyrus-bg border-2 border-papyrus-border papyrus-texture papyrus-shadow p-4 md:p-6',
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-papyrus-text">
            Filter Letters
          </h3>
          {hasActiveFilters && (
            <PapyrusButton
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear All
            </PapyrusButton>
          )}
        </div>
        <FilterContent />
      </div>
    </>
  );
};
