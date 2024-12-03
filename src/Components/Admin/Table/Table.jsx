import React, { Fragment } from 'react';

export function Table({
  headers,
  children,
  hideOnMobile,
  className = ''
}) {
  return (
    <Fragment>
      <div className="overflow-hidden w-full">
        <div className="w-full  overflow-auto scrollsdown">
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
            <tbody className='overflow-x-auto'>
              {children.map((b, index) => (
                <Fragment key={index}>{b}</Fragment>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </Fragment>
  );
}