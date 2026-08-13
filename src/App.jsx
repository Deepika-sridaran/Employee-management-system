import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './dummy/Dashboard.jsx';
import AddEmployee from './dummy/AddEmployee.jsx';
import EmployeeList from './dummy/EmployeeList.jsx';
import Profile from './dummy/Profile.jsx';
import NotFound from './dummy/NotFound.jsx';
import EditEmployee from './dummy/EditEmployee.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/employee-list" element={<EmployeeList />} />
      <Route path="/edit-employee/:id" element={<EditEmployee/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
   
    </Routes>
  );
}
export default App;