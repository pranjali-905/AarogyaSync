import React from 'react';

export function Table({ children, className = '', ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className={`w-full text-left border-collapse text-xs sm:text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '', ...props }) {
  return (
    <thead className={`bg-slate-50 border-b border-slate-200 text-slate-700 font-bold ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={`divide-y divide-slate-100 text-slate-800 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', hover = true, ...props }) {
  return (
    <tr
      className={`transition-colors ${hover ? 'hover:bg-slate-50/80' : ''} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '', ...props }) {
  return (
    <th
      className={`px-4 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider select-none ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`px-4 py-3.5 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}

export default Table;
