import React from 'react'
import Home from './pages/Home'
import { Routes , Route } from 'react-router-dom'
import Userlogin from './pages/Userlogin'
import ForgetPass from './pages/ForgetPass'
import UserDashboard from './pages/UserDashboard'
import ExpertLogin from './pages/Expertlogin'
import ExpertDashboard from './pages/ExpertDashboard'
import ExportProfile from './pages/ExpertProfile'
import UserPreviousIssue from './component/UserPreviousIssue'

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<Home></Home>}/>
        <Route path='/user-login' element={<Userlogin></Userlogin>} />
        <Route path='/forget-password' element={<ForgetPass></ForgetPass>}/>
        <Route path='/user-dashboard' element={<UserDashboard></UserDashboard>} ></Route>
        <Route path='/videocall' ></Route>
         <Route path='/expert-login' element={<ExpertLogin></ExpertLogin>} ></Route>
         <Route path='/expert-dashboard' element={<ExpertDashboard></ExpertDashboard>}></Route>
         <Route path='/expert/profile' element={<ExportProfile></ExportProfile>
         }></Route>
        <Route path='/user-dashboard/previous-issues' element={<UserPreviousIssue></UserPreviousIssue>} ></Route>
        

        
      </Routes>
      

      
    </div>
  )
}

export default App
