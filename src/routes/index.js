import { Routes, Route } from 'react-router-dom';

import SingIn from '../pages/SingIn';
import SingUp from '../pages/SingUp';
import Dashboard from '../pages/Dashboard';


function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={<SingIn />} />
            <Route path='/register' element={<SingUp />} />
            
            <Route path='/dashboard' element={<Dashboard />} />

        </Routes>
    )
}

export default RoutesApp;