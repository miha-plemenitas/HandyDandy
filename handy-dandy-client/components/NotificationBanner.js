'use client';

export default function NotificationBanner({ message, isError }) {
  if (!message) return null;
  return (
    <div className={`p-2 rounded mb-4 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {message}
    </div>
  );
}
