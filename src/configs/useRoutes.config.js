import React from "react";
import useTranslate from "@lang";
import Layout from "@views/layouts/Layout";
import Login from "@views/components/Login/Login";
import Home from "@views/Home";
import ProductDetail from "@views/components/ProductDetail/ProductDetail";
import LayoutClient from "@views/layouts/LayoutClient";
import Shop from "@views/Shop";
import Cart from "@views/Cart";
import Register from "@views/components/Login/Register";
import Contact from "@views/Contact";
import Dashboard from "@views/components/Dashboard/Dashboard";
import Checkout from "@views/components/Checkout/Checkout";
import ProductManager from "@views/components/Dashboard/ProductManager/ProductManager";
import Detail from "@views/components/Dashboard/ProductManager/Detail";
import Edit from "@views/components/Dashboard/ProductManager/Edit";
import BranchManager from "@views/components/Dashboard/BranchManager/BranchManager";
import DetailBranch from "@views/components/Dashboard/BranchManager/DetailBranch";
import EditBranch from "@views/components/Dashboard/BranchManager/EditBranch";
import OrderManager from "@views/components/Dashboard/OrderManager/OrderManager";
import DetailOrder from "@views/components/Dashboard/OrderManager/DetailOrder";
import ForgotPass from "@views/components/Login/ForgotPass";
import UserManager from "@views/components/Dashboard/UserManager/UserManager";
import DetailAccount from "@views/components/Dashboard/UserManager/DetailAccount";
import LayoutUser from "@views/layouts/LayoutUser";
import ProfileUser from "@views/components/ProfileUser/ProfileUser";
import History from "@views/components/History/History";
const ICON_SIZE = "15px";
const useRoutes = () => {
  const t = useTranslate();
  function getItem(label, key, path, icon, element, type) {
    return {
      label,
      key,
      icon,
      path,
      element,
      type,
    };
  }
  const publicRoutes = [
    {
      key: "/dashboard",
      label: t("dashboard").toCapitalize(),
      path: "/",
      element: (
        <LayoutClient>
          <Home />
        </LayoutClient>
      ),
    },
    {
      key: "/shop",
      label: t("product").toCapitalize(),
      path: "/shop",
      element: (
        <LayoutClient>
          <Shop />
        </LayoutClient>
      ),
    },
    {
      key: "/product",
      label: t("product").toCapitalize(),
      path: "/product/:id",
      element: (
        <LayoutClient>
          <ProductDetail />
        </LayoutClient>
      ),
    },

    {
      key: "/cart",
      label: t("product").toCapitalize(),
      path: "/cart",
      element: (
        <LayoutClient>
          <Cart />
        </LayoutClient>
      ),
    },
    {
      key: "/cart",
      label: t("cart").toCapitalize(),
      path: "/cart",
      element: (
        <LayoutClient>
          <Contact />
        </LayoutClient>
      ),
    },
    {
      key: "/login",
      label: t("login").toCapitalize(),
      path: "/login",
      element: (
        <LayoutClient>
          <Login />
        </LayoutClient>
      ),
    },
    {
      key: "/register",
      label: t("register").toCapitalize(),
      path: "/register",
      element: (
        <LayoutClient>
          <Register />
        </LayoutClient>
      ),
    },

    {
      key: "/contact",
      label: t("contact").toCapitalize(),
      path: "/contact",
      element: (
        <LayoutClient>
          <Contact />
        </LayoutClient>
      ),
    },

    {
      key: "/reset-pass",
      label: "ResetPass",
      path: "/reset-pass",
      element: <LayoutClient>
        <ForgotPass />
      </LayoutClient>
    },
    

    {
      key: "/dashboard",
      label: t("dashboard").toCapitalize(),
      path: "/dashboard",
      element: (
        <Dashboard />
      ),
    },

    {
      key: "/checkout",
      label: t("checkout").toCapitalize(),
      path: "/checkout",
      element: (
        <>
          <Checkout />
        </>
      ),
    },
  ];

  const privateRoutes = [
    {
      key: "/login",
      label: "login",
      path: "/login",
      element: <Login />,
    },
    {
      key: "/devices",
      label: "devices",
      path: "/devices",
      element: <Login />,
    },
    {
      key: "/dashboard/product",
      label: "devices",
      path: "/dashboard/product",
      element: <Layout>
        <ProductManager />
      </Layout>,
    },

    {
      key: "/dashboard/product/edit/:id",
      label: "Edit",
      path: "/dashboard/product/edit/:id",
      element: <Layout>
        <Edit />
      </Layout>,
    },
    {
      key: "/dashboard/product/:id",
      label: "product",
      path: "/dashboard/product/:id",
      element: <Layout>
        <Detail />
      </Layout>,
    },
    // branch
    {
      key: "/dashboard/branch",
      label: "Branch",
      path: "/dashboard/branch",
      element: <Layout>
        <BranchManager />
      </Layout>,
     
    },
    {
      key: "/dashboard/branch/:id",
      label: "Branch",
      path: "/dashboard/branch/:id",
      element: <Layout>
        < DetailBranch/>
      </Layout>,
     
    },

    {
      key: "/user-profile",
      label: "UserProfile",
      path: "/user-profile",
      element: <LayoutUser>
        <ProfileUser />
      </LayoutUser>
    },
    {
      key: "/dashboard/history-cart",
      label: "History",
      path: "/dashboard/history-cart",
      element: <LayoutUser>
        <History />
      </LayoutUser>
    },

    {
      key: "/dashboard/branch/edit/:id",
      label: "Branch",
      path: "/dashboard/branch/edit/:id",
      element: <Layout>
        <EditBranch />
      </Layout>,
     
    },
    //order
    {
      key: "/dashboard/order",
      label: "Order",
      path: "/dashboard/order",
      element: <Layout>
        <OrderManager />
      </Layout>
    },
    {
      key: "/dashboard/order/:id",
      label: "Order",
      path: "/dashboard/order/:id",
      element: <Layout>
        <DetailOrder />
      </Layout>
    },
    {
      key: "/dashboard/accounts",
      label: "Accounts",
      path: "/dashboard/accounts",
      element: <Layout>
        <UserManager />
      </Layout>
    },
    {
      key: "/dashboard/accounts/:userId",
      label: "Accounts",
      path: "/dashboard/accounts/:userId",
      element: <Layout>
        <DetailAccount />
      </Layout>
    }


  ];

  return {
    publicRoutes,
    privateRoutes,
    routes: [...publicRoutes, ...privateRoutes],
  };
};

export default useRoutes;
