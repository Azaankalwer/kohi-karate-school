import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Heart, UserCircle, Shield, Trash2, Wallet, ClipboardList } from 'lucide-react';
import { Student } from '../types/student';
import { Attendance } from '../types/attendance';
import { BankTransaction } from '../types/bankTransaction';
import { BankMapping } from '../types/bankMapping';
import { Promotion } from '../types/promotion';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { BeltRankingHistory } from './BeltRankingHistory';
import { useSettings } from '../contexts/SettingsContext';
import { useBeltRanks } from '../hooks/useBeltRanks';
import { usePromotions } from '../hooks/usePromotions';
import { StudentDetailsHeader } from './student-details/StudentDetailsHeader';
import { StudentDetailsTabs } from './student-details/StudentDetailsTabs';
import { GeneralTab } from './student-details/GeneralTab';
import { AttendanceTab } from './student-details/AttendanceTab';
import { BeltRankingTab } from './student-details/BeltRankingTab';
import { PaymentsTab } from './student-details/PaymentsTab';

type TabType = 'general' | 'attendance' | 'belt-ranking' | 'payments';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onUpdate: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  attendance?: Attendance[];
  bankTransactions?: BankTransaction[];
  bankMappings?: BankMapping[];
}

export function StudentDetails({ 
  student, 
  onClose, 
  onUpdate, 
  onDelete, 
  attendance = [],
  bankTransactions = [],
  bankMappings = []
}: StudentDetailsProps) {
  const [editedStudent, setEditedStudent] = useState<Student>(student);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const { settings } = useSettings();
  const { belts, isLoading: beltsLoading } = useBeltRanks();
  const { promotions, addPromotion, deletePromotion } = usePromotions(student.id);

  const handleChange = (field: keyof Student | 'emergencyContactName' | 'emergencyContactPhone', value: string) => {
    if (field === 'emergencyContactName') {
      setEditedStudent({
        ...editedStudent,
        emergencyContact: { ...editedStudent.emergencyContact, name: value }
      });
    } else if (field === 'emergencyContactPhone') {
      setEditedStudent({
        ...editedStudent,
        emergencyContact: { ...editedStudent.emergencyContact, phone: value }
      });
    } else {
      setEditedStudent({ ...editedStudent, [field]: value });
    }
  };

  const handleSave = () => {
    onUpdate(editedStudent);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(student.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <StudentDetailsHeader 
          onClose={onClose} 
          onDelete={onDelete ? () => setShowDeleteModal(true) : undefined} 
        />

        <StudentDetailsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="space-y-6">
          {activeTab === 'general' && (
            <GeneralTab 
              student={editedStudent} 
              onChange={handleChange} 
            />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab 
              studentId={student.id} 
              attendance={attendance} 
              settings={settings} 
            />
          )}
          {activeTab === 'belt-ranking' && (
            <BeltRankingTab 
              student={editedStudent}
              belts={belts}
              beltsLoading={beltsLoading}
              promotions={promotions}
              onBeltChange={(value) => handleChange('beltRank', value)}
              onAddPromotion={addPromotion}
              onDeletePromotion={deletePromotion}
            />
          )}
          {activeTab === 'payments' && (
            <PaymentsTab 
              studentId={student.id}
              bankTransactions={bankTransactions}
              bankMappings={bankMappings}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>

        {showDeleteModal && (
          <DeleteConfirmationModal
            studentName={`${student.firstName} ${student.lastName}`}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
}