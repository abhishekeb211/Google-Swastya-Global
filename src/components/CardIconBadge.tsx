import React from 'react';

export type IconBadgeVariant = 'emerald' | 'teal' | 'amber' | 'rose' | 'blue' | 'indigo' | 'slate';

interface CardIconBadgeProps {
  icon: React.ReactNode;
  variant?: IconBadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardIconBadge: React.FC<CardIconBadgeProps> = ({
  icon,
  variant = 'emerald',
  size = 'md',
  className = '',
}) => {
  const getVariantStyles = (v: IconBadgeVariant) => {
    switch (v) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'teal':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'blue':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'slate':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80';
    }
  };

  const getSizeStyles = (s: 'sm' | 'md' | 'lg') => {
    switch (s) {
      case 'sm':
        return 'w-7 h-7 rounded-lg text-xs';
      case 'lg':
        return 'w-11 h-11 rounded-2xl text-base';
      case 'md':
      default:
        return 'w-9 h-9 rounded-xl text-sm';
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border transition-transform duration-200 ${getVariantStyles(
        variant
      )} ${getSizeStyles(size)} ${className}`}
    >
      {icon}
    </div>
  );
};
