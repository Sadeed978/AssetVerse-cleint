import { createBrowserRouter } from "react-router";
import Root from "./Root";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import HRRegistration from "./Pages/HRRegistration";
import EmployeeRegistration from "./Pages/EmployeeRegistration";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement:<ErrorPage></ErrorPage>,
    children:[
      {
        index:true,
        Component:Home,
      },
      {
        path:"/HRRegister",
        Component:HRRegistration,
      },
      {
        path:"/EmployeeRegister",
        Component:EmployeeRegistration,
      },
    ]
  },
]);