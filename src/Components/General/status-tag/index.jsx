import React from 'react';
import './index.scss';

const StatusTag = ({ variant, size = 'medium', className = '', children }) => {
  return <span className={`status-tag ${size} ${variant} ${className}`}>{children}</span>;
};

export default StatusTag;
