import React from 'react';
import { Trash2, Link } from 'lucide-react';
import { Student } from '../../types/student';
import { BankMapping } from '../../types/bankMapping';
import { deleteBankMapping } from '../../services/firebase/bankMappings';

interface BankMappingsTabProps {
  mappings: BankMapping[];
  students: Student[];
  onMappingDeleted: () => void;
}

export function BankMappingsTab({ mappings, students, onMappingDeleted }: BankMappingsTabProps) {
  const handleDelete = async (mappingId: string) => {
    try {
      await deleteBankMapping(mappingId);
      onMappingDeleted();
    } catch (error) {
      console.error('Error deleting mapping:', error);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Bank Account Mappings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4 text-left">Bank Account</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping) => (
              <tr key={mapping.id} className="border-b border-gray-100">
                <td className="py-3 px-4">{getStudentName(mapping.studentId)}</td>
                <td className="py-3 px-4">{mapping.otherPartyAccount}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(mapping.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete Mapping"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}