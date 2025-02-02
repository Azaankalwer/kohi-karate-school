import React from 'react';
import { AttendanceTab } from './AttendanceTab';
import { StudentsTab } from './tabs/StudentsTab';
import { RegistrationTab } from './tabs/RegistrationTab';
import { SettingsTab } from './SettingsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { BankingTab } from './BankingTab';
import { Tab, AppMode } from '../types/navigation';

interface MainContentProps {
  mode: AppMode;
  activeTab: Tab;
  data: {
    students: any[];
    attendance: any[];
    classes: any[];
    bankTransactions: any[];
    bankMappings: any[];
  };
  handlers: {
    handleRegister: (data: any) => void;
    handleCheckIn: (studentId: string, date: string, classId?: string) => void;
    handleCreateClass: (name: string, date: string) => void;
    handleUpdateStudent: (student: any) => void;
    handleDeleteStudent: (studentId: string) => void;
  };
  onSelectStudent: (student: any) => void;
}

export function MainContent({
  mode,
  activeTab,
  data,
  handlers,
  onSelectStudent
}: MainContentProps) {
  const { students, attendance, classes, bankTransactions, bankMappings } = data;

  if (mode === 'admin' && activeTab === 'attendance') {
    return (
      <AttendanceTab
        students={students}
        attendance={attendance}
        classes={classes}
        onCheckIn={handlers.handleCheckIn}
        onCreateClass={handlers.handleCreateClass}
        onRemoveAttendance={handlers.handleDeleteStudent}
      />
    );
  }

  if (activeTab === 'registration') {
    return (
      <RegistrationTab
        onRegister={handlers.handleRegister}
        lastRegisteredStudent={students.find(s => 
          s.id === localStorage.getItem('lastRegisteredStudent')
        )}
      />
    );
  }

  if (mode === 'admin' && activeTab === 'students') {
    return (
      <StudentsTab
        students={students}
        onSelectStudent={onSelectStudent}
        attendance={attendance}
        bankTransactions={bankTransactions}
        bankMappings={bankMappings}
        onDataChange={() => {/* Implement data refresh */}}
      />
    );
  }

  if (mode === 'admin' && activeTab === 'analytics') {
    return (
      <AnalyticsTab
        attendance={attendance}
        students={students}
      />
    );
  }

  if (mode === 'admin' && activeTab === 'banking') {
    return <BankingTab />;
  }

  if (mode === 'admin' && activeTab === 'settings') {
    return <SettingsTab />;
  }

  return null;
}