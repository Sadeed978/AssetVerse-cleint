import React from 'react';
import { use } from 'react';
const Pacages = ({pacagePromise}) => {
    const pacage =use(pacagePromise)
    console.log(pacage);
    return (
        <div>
            
        </div>
    );
};

export default Pacages;