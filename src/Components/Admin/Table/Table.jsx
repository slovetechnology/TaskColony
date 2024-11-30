import React, { Fragment } from 'react';

export function Table({
  headers,
  children,
  hideOnMobile,
  className = ''
}) {
  return (
    <Fragment>
      <div className="w-full">
        <table className={`table ${hideOnMobile ? 'lg-and-above' : ''} ${className}`}>
          <thead className="bg-yellow h-12">
            <tr className="table__head__row">
              {headers.map((h, i) => (
                <th key={i} className="table__head__row__text">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=''>
            {children.map((b, index) => (
              <Fragment key={index}>{b}</Fragment>
            ))}
          </tbody>

        </table>
      
      </div>
    </Fragment>
  );
}