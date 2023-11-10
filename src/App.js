import Header from './common/Header';
import SidebarDoctor from './common/Sidebar-Doctor'
import SidebarPatient from './common/Sidebar-patient'
import Welcome from './common/Welcome'
import Appointment from './components/Appointment'
import PatientDetails from './components/PatientDetails'

function App() {
  return (
    <>
      {/* <Header />
      <div className='d-flex'>
        <SidebarDoctor />
        <div className='w-100 bg-body wrapper custom-scroll'>
          <Welcome />
          <Appointment />
        </div>
      </div> */}
      
      <div className='d-flex'>
        <SidebarPatient />
        <div className='w-100 bg-body vh-100 overflow-y-auto'>
          <Welcome />
          <PatientDetails />
        </div>
      </div>
    </>
  );
}

export default App;
