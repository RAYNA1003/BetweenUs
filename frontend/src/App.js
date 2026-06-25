
import './App.css';
import {Route,BrowserRouter as Router,Routes} from 'react-router-dom';
import LandingPage from './pages/landing';
import HomeComponent from './pages/home.jsx'
import Authentication from './pages/authentication.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Authcontext } from './contexts/AuthContext.jsx';
import Vidmeetcomponent from './pages/vidmeet.jsx';
import History from './pages/history.jsx';

function App() {
  return (
   <>

   <Router>
   <AuthProvider>

   
    <Routes>
     <Route path='/' element={<LandingPage />} />
     <Route path='/auth' element={<Authentication />} />
      <Route path='/home' element={<HomeComponent />} />
     <Route path=':url' element={<Vidmeetcomponent/>} />
     <Route path='/history' element={<History/>} />
    </Routes>
    </AuthProvider>
    </Router>
   </>
  )
}

export default App;
