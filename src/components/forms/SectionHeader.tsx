import React from 'react';

export const SectionHeader = ({ title, className }: { title: string; className?: string }) => (
  <div className={`bg-[#1846b0] text-white text-center py-2.5 rounded-lg font-bold tracking-wider mb-6 text-sm mt-8 ${className || ''}`}>{title}</div>
);
