import React from 'react';
import { use } from 'react';
import SinglePacage from './SinglePacage';

const Pacages = ({ pacagePromise }) => {
    const pacages = use(pacagePromise);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10">
            {pacages.map(pacage => (
                <SinglePacage key={pacage._id} pacage={pacage} />
            ))}
        </div>
    );
};

export default Pacages;
