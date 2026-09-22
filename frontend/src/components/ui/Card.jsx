import React from 'react';
import { ChevronRight } from 'lucide-react';

export function Card({ children, className = '', hover = false, interactive = false, ...props }) {
  const hoverClass = interactive 
    ? 'rural-card-interactive' 
    : hover 
    ? 'rural-card rural-card-hover' 
    : 'rural-card';

  return (
    <div className={`${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-5 sm:p-6 pb-2 sm:pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`font-bold text-slate-900 text-base sm:text-lg tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-5 sm:p-6 pt-2 sm:pt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`p-5 sm:p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * StatCard for healthcare overview metrics (e.g. Registered Citizens, Active ASHA)
 */
export function StatCard({ label, value, icon, trend, subtext, className = '', color = 'teal', ...props }) {
  const colorMap = {
    teal: 'bg-ruralTeal-50 text-ruralTeal-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700'
  };

  return (
    <Card className={`p-4 sm:p-5 ${className}`} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {label}
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
          {trend && (
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
              {trend}
            </span>
          )}
          {subtext && (
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {subtext}
            </span>
          )}
        </div>

        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.teal}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * ActionCard for quick access navigation cards
 */
export function ActionCard({ icon, title, description, badge, onClick, rightChevron = true, className = '', ...props }) {
  return (
    <div
      onClick={onClick}
      className={`rural-card rural-card-hover p-5 flex flex-col justify-between group cursor-pointer active:scale-[0.99] ${className}`}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-ruralTeal-50 text-ruralTeal-700 flex items-center justify-center group-hover:bg-ruralTeal-700 group-hover:text-white transition-colors">
              {icon}
            </div>
          )}
          {badge && (
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {badge}
            </span>
          )}
        </div>

        <h4 className="font-bold text-slate-900 text-base group-hover:text-ruralTeal-800 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {rightChevron && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-xs font-bold text-ruralTeal-700">
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );
}

export default Card;
