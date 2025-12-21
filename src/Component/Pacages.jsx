import React from 'react';

import { use } from 'react';
import SinglePacage from './SinglePacage';

const Pacages = ({pacagePromise}) => {
    const pacages =use(pacagePromise)
    console.log(pacages);
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-12 bg-amber-50'>
            {
                pacages.map(pacage =><SinglePacage key={pacage._id} pacage={pacage}></SinglePacage>)
            }
        </div>
    );
};

export default Pacages;