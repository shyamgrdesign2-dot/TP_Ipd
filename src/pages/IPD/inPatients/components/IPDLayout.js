import { Outlet } from "react-router-dom";
import IPDHeader from "./IPDHeader";
import IPDNavBar from "./IPDNavBar";

export default function IPDLayout() {
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
