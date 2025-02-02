import React from 'react';
import { User, Phone, Mail, Calendar, Heart, UserCircle } from 'lucide-react';
import { Student } from '../../types/student';

interface GeneralTabProps {
  student: Student;
  onChange: (field: keyof Student | 'emergencyContactName' | 'emergencyContactPhone', value: string) => void;
}

export function GeneralTab({ student, onChange }: GeneralTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="mt-1 flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={student.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <div className="mt-1 flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={student.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 flex items-center">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              value={student.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 flex items-center">
            <Phone className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="tel"
              value={student.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="mt-1 flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="date"
              value={student.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <div className="mt-1">
            <select
              value={student.type}
              onChange={(e) => onChange('type', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Student">Student</option>
              <option value="Trial">Trial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="mt-1">
            <select
              value={student.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="mt-1">
            <select
              value={student.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Old">Old</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Medical Notes</label>
        <div className="mt-1 flex items-center">
          <Heart className="w-5 h-5 text-gray-400 mr-2" />
          <textarea
            value={student.medicalNotes || ''}
            onChange={(e) => onChange('medicalNotes', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <UserCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Emergency Contact</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              value={student.emergencyContact.name}
              onChange={(e) => onChange('emergencyContactName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              value={student.emergencyContact.phone}
              onChange={(e) => onChange('emergencyContactPhone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}