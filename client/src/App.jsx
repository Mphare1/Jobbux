
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreateJob from './pages/CreateJob'
import UpdateJob from './pages/UpdateJob'
import JobPage from './pages/JobPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>  
        <Route element={<OnlyAdminPrivateRoute/>}>
        <Route path="/create-job" element={<CreateJob/>} />
        <Route path='/update-job/:postId' element={<UpdateJob/>} />
        </Route>  
        <Route path='/post/:postSlug' element={<JobPage/>} />  
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
