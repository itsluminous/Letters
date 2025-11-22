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

export const FilterPanel: React.FC<FilterPanelProps> = ({
  contacts, filters, onFilterChange, className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleContactChange = (value: string | string[]) => onFilterChange({ ...filters, contactIds: Array.isArray(value) ? value : [value] });
  const handleBeforeDateChange = (date: Date | null) => onFilterChange({ ...filters, beforeDate: date });
  const handleAfterDateChange = (date: Date | null) => onFilterChange({ ...filters, afterDate: date });
  const handleClearFilters = () => onFilterChange({ contactIds: [], beforeDate: null, afterDate: null });

  const hasActiveFilters = filters.contactIds.length > 0 || filters.beforeDate !== null || filters.afterDate !== null;

  const contactOptions = contacts.map((contact) => ({ value: contact.contactUserId, label: contact.displayName }));

  const FilterContent = () => (
    <div className="space-y-4">
        <PapyrusSelect
          label="Filter by Contact"
          options={contactOptions}
          value={filters.contactIds}
          onChange={handleContactChange}
          placeholder="All contacts"
          multiple
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PapyrusDatePicker label="Before" value={filters.beforeDate} onChange={handleBeforeDateChange} placeholder="End date" />
          <PapyrusDatePicker label="After" value={filters.afterDate} onChange={handleAfterDateChange} placeholder="Start date" />
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between',
            'bg-[#e6d5b8] border-b-2 border-[#d4c4a8]', // Darker beige for utility bar
            'px-4 py-3 font-heading text-ink font-bold text-sm uppercase tracking-wide',
            'transition-colors hover:bg-[#d4c4a8]'
          )}
        >
          <span>Filters {hasActiveFilters && '• Active'}</span>
          <span>{isOpen ? '−' : '+'}</span>
        </button>

        {isOpen && (
          <div className="bg-[#fdf6e3] p-4 border-b border-[#d4c4a8] animate-slide-up">
             <FilterContent />
             {hasActiveFilters && (
               <button onClick={handleClearFilters} className="mt-4 text-sm text-wax font-bold hover:underline">Clear Filters</button>
             )}
          </div>
        )}
      </div>

      {/* Desktop Panel */}
      <div className={cn('hidden md:block bg-transparent border-b border-ink/10 pb-6 mb-6', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between mb-4 cursor-pointer',
            'hover:opacity-80 transition-opacity'
          )}
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-ink-light">
            Filter Correspondence {hasActiveFilters && '• Active'}
          </h3>
          <span className="text-ink-light font-bold">{isOpen ? '−' : '+'}</span>
        </button>
        
        {isOpen && (
          <div className="animate-slide-up">
            <FilterContent />
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="mt-4 text-xs text-wax font-bold hover:underline uppercase tracking-wide cursor-pointer">
                Clear All
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};