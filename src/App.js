import React, { useState } from "react";
import Header from './common/Header';
import SidebarDoctor from './common/Sidebar-Doctor'
import SidebarPatient from './common/Sidebar-patient'
import Welcome from './common/Welcome'
import Appointment from './components/Appointment'
import PatientDetails from './components/PatientDetails'
import { Layout, Button, theme } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import variables from './assets/scss/variables.scss'

const { Sider, Content } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  return (
    <>
      <Header />
      <div className='d-flex'>
        <SidebarDoctor />
        <div className='w-100 bg-body wrapper custom-scroll'>
          <Welcome />
          <Appointment />
        </div>
      </div>

      {/* <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'ant-layout-sider1' : 'ant-layout-sider'}>
          <div className='d-flex align-items-center justify-content-between'>
            <button type='button' className='btn btn-action d-flex align-items-center'>
              <i className="icon-right" style={{ color: !collapsed && variables.grayColor }}></i> <div className="backbar">{!collapsed && '\u00A0Back'}</div>
            </button>
            <Button className={collapsed ? 'collapseborder border rounded-10px' : ''} style={collapsed && { marginRight: -12, backgroundColor: 'white', zIndex: 1, }} type="text" icon={collapsed ? <i className='icon-Expand fs-21'></i> : <i className='icon-Contract fs-21'></i>} onClick={() => setCollapsed(!collapsed)} />
          </div>
          <SidebarPatient collapsed={collapsed} />
        </Sider>

        <Content>
          <div className='w-100 vh-100 overflow-y-auto'>
            <Welcome />
            <PatientDetails />
          </div>
        </Content>

      </Layout> */}
    </>
  );
}

export default App;
