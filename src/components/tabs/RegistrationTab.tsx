import React from 'react';
import { StudentRegistration } from '../StudentRegistration';
import { Student } from '../../types/student';
import { CheckCircle } from 'lucide-react';
import { addLogin } from '../../services/firebase/logins';
import { useTenant } from '../../contexts/TenantContext';

interface RegistrationTabProps {
  onRegister: (studentData: Partial<Student>) => void;
  lastRegisteredStudent: Student | null;
}

export function RegistrationTab({ onRegister, lastRegisteredStudent }: RegistrationTabProps) {
  const { currentTenant } = useTenant();

  const handleRegister = async (studentData: Partial<Student>, password: string) => {
    if (!currentTenant) {
      throw new Error('No tenant selected');
    }

    try {
      // First register the student
      await onRegister(studentData);

      // Then create a login for the student
      if (studentData.email) {
        await addLogin({
          email: studentData.email,
          password: password
        }, currentTenant.id);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      {lastRegisteredStudent && <RegistrationSuccess student={lastRegisteredStudent} />}
      <StudentRegistration onRegister={handleRegister} />
    </div>
  );
}

function RegistrationSuccess({ student }: { student: Student }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">Registration Successful!</h3>
      </div>
      <div className="pl-9 space-y-2 text-green-800">
        <p>
          <span className="font-medium">Student Name:</span>{' '}
          {student.firstName} {student.lastName}
        </p>
        <p>
          <span className="font-medium">Belt Rank:</span>{' '}
          {student.beltRank}
        </p>
        <p>
          <span className="font-medium">Registration Date:</span>{' '}
          {new Date(student.joinDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}