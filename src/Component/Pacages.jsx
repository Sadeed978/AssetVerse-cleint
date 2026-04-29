import React, { use } from 'react';
import SinglePacage from './SinglePacage';

const Pacages = ({ pacagePromise }) => {
  const pacages = use(pacagePromise);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {pacages.map(p => <SinglePacage key={p._id} pacage={p} />)}
    </div>
  );
};

export default Pacages;
