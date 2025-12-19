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
              path:'/AssetList',
              element:<PrivateRoute><AssetList></AssetList></PrivateRoute>
            },
            {
              path:'/AddAssert',
              element:<PrivateRoute><AddAssert></AddAssert></PrivateRoute>
          
            },
            {
              path:'/AllRequiests',
              element:<PrivateRoute><AllRequiest></AllRequiest></PrivateRoute>
           },
           {
            path:'/EmployeeList',
            element:<PrivateRoute><EmployeeList></EmployeeList></PrivateRoute>
        
          },
          {
            path:'/MyAssets',
            element:<PrivateRoute><MyAssert></MyAssert></PrivateRoute>
          },
          {
            path:'/myteam',
            element:<PrivateRoute><MyTeam></MyTeam></PrivateRoute>
          },
          {
            path:'/assetsDetails/:id',
            loader:({params})=>fetch(`http://localhost:3000/assets/${params.id}`),
            element:<PrivateRoute><AssetsDetails></AssetsDetails></PrivateRoute>
          },
          {
            path:'/RequestAsset',
            loader:()=>fetch('http://localhost:3000/assets'),
            element:<PrivateRoute><RequestAsset></RequestAsset></PrivateRoute>
          }
        ]
      }
    
]);