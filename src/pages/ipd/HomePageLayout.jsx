import { Outlet } from "react-router-dom";
import IPDHeader from "./components/IPDHeader";
import IPDNavBar from "./components/IPDNavBar";

export default function HomePageLayout() {
  return (
    <>
      <IPDHeader />
      <div className="d-flex">
        <IPDNavBar />
        <div className={"w-100 bg-body vh-100"}>
          <Outlet />
        </div>
      </div>
    </>
  );
}
