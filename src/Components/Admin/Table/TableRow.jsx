import { Input } from 'postcss';
import React from 'react';

export function TableRow({
  children,
  className = '',
  onClick
}) {
  return (
    <tr className={`table__row ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
}
