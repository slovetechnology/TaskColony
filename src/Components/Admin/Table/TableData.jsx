import React from 'react';

export function TableData({ children, className = '' }) {
  return <td className={`table__data_cell ${className}`}>{children}</td>;
}