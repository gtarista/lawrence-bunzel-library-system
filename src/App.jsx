/*    COLLABORATORS
*        
*        
*        Reo Anne Dela Rita
*        Josh Ratificar
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LANDINGPAGE, HOME, REGISTER, CREATEBOOK, SHELF, ABOUTBOOK } from './lib/routes.js';
import { ShelfPage } from './pages/ShelfPage';
import { HomePage } from './pages/HomePage';
import { CreateBook } from './components/CreateBook';
import { AboutBookPage } from './pages/AboutBookPage';
import { RegisterPage } from './pages/RegisterPage';
import { Navbar } from './components/Navbar';

function App() {
  const wrapNavBar = (componentIN) => {
    return (
      <>
        <Navbar />
        {componentIN}
      </>
    );
  };
  return (
    <Router>
      
      <Routes>
        <Route path = {LANDINGPAGE} element = {<LandingPage />}/>
        <Route path = {HOME} element = {wrapNavBar(<HomePage />)}/>
        <Route path = {REGISTER} element = {<RegisterPage />}/>
        <Route path = {CREATEBOOK} element = {<CreateBook />}/>
        <Route path = {SHELF} element = {wrapNavBar(<ShelfPage />)}/>
        <Route path = {ABOUTBOOK} element = {wrapNavBar(<AboutBookPage />)}/>
        <Route path = '/*' element = {<div>Error Detected</div>}/> /*Good Catch...*/
      </Routes>
    </Router>
  );
};

export default App
