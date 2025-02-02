import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SortField, SortDirection } from '../types/sorting';
import { BELT_RANKS } from '../types/student';

interface StudentListHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  beltFilter: string;
  onBeltFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

function SortIcon({ field, currentField, direction }: { 
  field: SortField; 
  currentField: SortField; 
  direction: SortDirection;
}) {
  if (field !== currentField) return null;
  return direction === 'asc' ? 
    <ChevronUp className="w-4 h-4" /> : 
    <ChevronDown className="w-4 h-4" />;
}

export function StudentListHeader({ 
  sortField, 
  sortDirection, 
  onSort,
  beltFilter,
  onBeltFilterChange,
  typeFilter,
  onTypeFilterChange
}: StudentListHeaderProps) {
  const renderSortableHeader = (label: string, field: SortField) => (
    <th 
      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon field={field} currentField={sortField} direction={sortDirection} />
      </div>
    </th>
  );

  return (
    <thead>
      <tr className="border-b border-gray-200">
        {renderSortableHeader('Name', 'name')}
        <th className="py-3 px-4 text-left">
          <div className="flex items-center gap-2">
            Belt
            <select
              value={beltFilter}
              onChange={(e) => onBeltFilterChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="All">All Belts</option>
              {BELT_RANKS.map(belt => (
                <option key={belt} value={belt}>{belt}</option>
              ))}
            </select>
          </div>
        </th>
        {renderSortableHeader('Last Class', 'lastClass')}
        {renderSortableHeader('Total', 'totalClasses')}
        <th className="py-3 px-4 text-left">Since</th>
        <th className="py-3 px-4 text-left">Days</th>
        {renderSortableHeader('3x', 'payments3m')}
        {renderSortableHeader('6x', 'payments6m')}
        <th className="py-3 px-4 text-left">Bank</th>
        <th className="py-3 px-4 text-left">
          <div className="flex items-center gap-2">
            Type
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Trial">Trial</option>
            </select>
          </div>
        </th>
        <th className="py-3 px-4 text-right">Actions</th>
      </tr>
    </thead>
  );
}