import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Authorization from './Pages/Authorization';
import Registration from './Pages/Registration';
import Main from './Pages/Main/Main';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Authorization />}></Route>
          <Route path='/main' element={<Main />}></Route>
          <Route path='registration' element={ <Registration />}></Route>
        </Routes>
    </Router>
  );
}

export default App;
