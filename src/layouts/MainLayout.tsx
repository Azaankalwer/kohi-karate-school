import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Header } from '../components/Header';
import { TabNavigation } from '../components/TabNavigation';
import { MainContent } from '../components/MainContent';
import { StudentDetails } from '../components/StudentDetails';
import { AdminPasswordModal } from '../components/AdminPasswordModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAppMode } from '../contexts/AppModeContext';
import { useTenant } from '../contexts/TenantContext';
import { useAppData } from '../hooks/useAppData';
import { Tab } from '../types/navigation';

export function MainLayout() {
  const { mode, toggleMode } = useAppMode();
  const { currentTenant } = useTenant();
  const [activeTab, setActiveTab] = useState<Tab>('registration');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const {
    data: { students, attendance, classes, bankTransactions, bankMappings },
    isLoading,
    handlers
  } = useAppData();

  useEffect(() => {
    if (mode === 'register') {
      setActiveTab('registration');
    }
  }, [mode]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        tenant={currentTenant}
        mode={mode}
        onModeToggle={() => mode === 'register' ? setShowAdminModal(true) : toggleMode()}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          <MainContent
            mode={mode}
            activeTab={activeTab}
            data={{ students, attendance, classes, bankTransactions, bankMappings }}
            handlers={handlers}
            onSelectStudent={setSelectedStudent}
          />
        </div>
      </main>

      {selectedStudent && mode === 'admin' && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={handlers.handleUpdateStudent}
          onDelete={handlers.handleDeleteStudent}
          attendance={attendance}
          bankTransactions={bankTransactions}
          bankMappings={bankMappings}
        />
      )}

      {showAdminModal && (
        <AdminPasswordModal
          onSuccess={() => {
            setShowAdminModal(false);
            toggleMode();
          }}
          onCancel={() => setShowAdminModal(false)}
        />
      )}
    </div>
  );
}