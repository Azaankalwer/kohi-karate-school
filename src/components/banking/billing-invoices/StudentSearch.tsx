import React, { useState, useEffect } from 'react';
import { useStudentSearch } from '../hooks/useStudentSearch';
import type { StudentOption } from '../../../types/student';

interface StudentSearchProps {
  onSelect: (option: StudentOption) => void;
  placeholder?: string;
  initialValue?: StudentOption | null;
  disabled?: boolean;
}

export function StudentSearch({ 
  onSelect, 
  placeholder = 'Search students...', 
  initialValue = null,
  disabled = false
}: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { loading, students } = useStudentSearch(searchTerm);

  useEffect(() => {
    if (initialValue) {
      setSearchTerm(initialValue.label);
    }
  }, [initialValue]);

  const handleSelect = (option: StudentOption) => {
    onSelect(option);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      
      {isOpen && !disabled && (searchTerm.length >= 2 || loading) && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading...</div>
          ) : students.length > 0 ? (
            <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
              {students.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500">No students found</div>
          )}
        </div>
      )}
    </div>
  );
}