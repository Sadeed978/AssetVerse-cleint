import { createBrowserRouter } from "react-router";
import Root from "./Root";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import HRRegistration from "./Pages/HRRegistration";
import EmployeeRegistration from "./Pages/EmployeeRegistration";
import Login from "./Pages/Login";
import AssetList from "./Pages/AssetList";
import AddAssert from "./Pages/AddAssert";
import EmployeeList from "./Pages/EmployeeList";
import PrivateRoute from "./PrivateRoute/PrivateRoutes";
import MyAssert from "./Pages/Employee/MyAssert";
import MyTeam from "./Pages/Employee/MyTeam";
import RequestAsset from "./Pages/Employee/RequestAsset";
import AllRequiest from "./Pages/AllRequiest";
import AssetsDetails from "./Pages/AssetsDetails";
import DashboardLayout from "./DashboardLayout";
import EmployeeDashboard from "./Pages/Dashboard/EmployeeDashboard";
import HrDashboard from "./Pages/Dashboard/HrDashboard";
import Profile from "./Pages/Profile";
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
      {
        path:"/Login",
        Component:Login,
      }
    ]
    },
      {
        path:'/',
        Component:DashboardLayout,
        children:[
          
            {
              path:'/Dashboard/AssetList',
              element:<PrivateRoute><AssetList></AssetList></PrivateRoute>
            },
            {
              path:'/Dashboard/AddAssert',
              element:<PrivateRoute><AddAssert></AddAssert></PrivateRoute>
          
            },
            {
              path:'/Dashboard/AllRequiests',
              element:<PrivateRoute><AllRequiest></AllRequiest></PrivateRoute>
           },
           {
            path:'/Dashboard/EmployeeList',
            element:<PrivateRoute><EmployeeList></EmployeeList></PrivateRoute>
        
          },
          {
            path:'/Dashboard/MyAssets',
            element:<PrivateRoute><MyAssert></MyAssert></PrivateRoute>
          },
          {
            path:'/Dashboard/myteam',
            element:<PrivateRoute><MyTeam></MyTeam></PrivateRoute>
          },
          {
            path:'/Dashboard/assetsDetails/:id',
            loader:({params})=>fetch(`https://asset-verse-server-phi.vercel.app/assets/${params.id}`),
            element:<PrivateRoute><AssetsDetails></AssetsDetails></PrivateRoute>
          },
          {
            path:'/Dashboard/RequestAsset',
            loader:()=>fetch('https://asset-verse-server-phi.vercel.app/assets'),
            element:<PrivateRoute><RequestAsset></RequestAsset></PrivateRoute>
          },
          {
            path:'/Dashboard/Profile',
            element:<PrivateRoute><Profile></Profile></PrivateRoute>
          },
          {
            path:'/Dashboard/Employee',
            element:<PrivateRoute><EmployeeDashboard></EmployeeDashboard></PrivateRoute>
          },
          {
            path:'/Dashboard/HR',
            element:<PrivateRoute><HrDashboard></HrDashboard></PrivateRoute>
          }
        ]
      }
    
]);