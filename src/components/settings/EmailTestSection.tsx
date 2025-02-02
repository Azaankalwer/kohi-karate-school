import React, { useState } from 'react';
import { Mail, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { sendEmail } from '../../services/email/emailService';

export function EmailTestSection() {
  const [formData, setFormData] = useState({
    to: '',
    from: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    try {
      const response = await sendEmail({
        to: formData.to,
        from: formData.from || undefined,
        subject: formData.subject,
        text: formData.message,
        html: formData.message.replace(/\n/g, '<br>')
      });

      if (response.success) {
        setResult({
          success: true,
          message: 'Test email sent successfully!'
        });
      } else {
        setResult({
          success: false,
          message: response.error || 'Failed to send test email'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-medium text-gray-900">Test Email Configuration</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">To Email</label>
          <input
            type="email"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Email (Optional)
          </label>
          <input
            type="email"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Default sender will be used if empty"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {result && (
          <div className={`p-4 rounded-md ${
            result.success ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Test Email
            </>
          )}
        </button>
      </form>
    </div>
  );
}