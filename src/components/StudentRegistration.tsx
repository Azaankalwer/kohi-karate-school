import React, { useState } from 'react';
import { UserPlus, User, Phone, Mail, Calendar, Heart, UserCircle, Lock, Shield } from 'lucide-react';
import { Student, StudentType, BeltRank, BELT_RANKS } from '../types/student';
import { getBeltColor } from '../utils/beltColors';

interface StudentRegistrationProps {
  onRegister: (studentData: Partial<Student>, password: string) => void;
}

export function StudentRegistration({ onRegister }: StudentRegistrationProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    type: 'Student' as StudentType,
    beltRank: 'White' as BeltRank,
    medicalNotes: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
  });
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData, password);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      type: 'Student',
      beltRank: 'White',
      medicalNotes: '',
      emergencyContact: {
        name: '',
        phone: ''
      }
    });
    setPassword('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Student Registration</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <div className="mt-1 flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <div className="mt-1 flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 flex items-center">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="mt-1 flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Belt Rank</label>
            <div className="mt-1 flex items-center">
              <Shield className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={formData.beltRank}
                onChange={(e) => setFormData({ ...formData, beltRank: e.target.value as BeltRank })}
                className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${getBeltColor(formData.beltRank)}`}
                required
              >
                {BELT_RANKS.map(rank => (
                  <option key={rank} value={rank} className={getBeltColor(rank)}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-1 flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Student Type</label>
          <div className="mt-1">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as StudentType })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Student">Student</option>
              <option value="Trial">Trial</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Notes</label>
          <div className="mt-1 flex items-center">
            <Heart className="w-5 h-5 text-gray-400 mr-2" />
            <textarea
              value={formData.medicalNotes}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Enter any medical conditions, allergies, or special requirements"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <UserCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Register Student
        </button>
      </form>
    </div>
  );
}