import React from 'react';
import initFirebase from './component/initFirebase';
//import CRUD from './component/CRUD';
import Users from './component/Users';

function App() {
  initFirebase();
  return (
    <div className='container'><br/>
        {/* <CRUD /> */}
        <Users />
    </div>
  );
}

export default App;
