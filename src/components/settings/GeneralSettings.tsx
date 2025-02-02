import React, { useState } from 'react';
import { Settings, Sliders, Save, Download } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { generateStudentCSV, downloadCSV } from '../../utils/csvExport';
import { fetchStudents } from '../../services/firebase/students';
import { EmailTestSection } from './EmailTestSection';

export function GeneralSettings() {
  const { settings, updateSettings } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastGradingDate, setLastGradingDate] = useState(settings.lastGradingDate);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings({ lastGradingDate });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportStudents = async () => {
    try {
      setIsExporting(true);
      const students = await fetchStudents();
      const csvContent = generateStudentCSV(students);
      const filename = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting students:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Grading Date
        </label>
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={lastGradingDate}
            onChange={(e) => setLastGradingDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          This date is used to calculate classes attended since the last grading.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
        <button
          onClick={handleExportStudents}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Settings className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Students CSV
            </>
          )}
        </button>
        <p className="mt-2 text-sm text-gray-500">
          Download a CSV file containing all student records.
        </p>
      </div>

      <EmailTestSection />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || lastGradingDate === settings.lastGradingDate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Settings className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}