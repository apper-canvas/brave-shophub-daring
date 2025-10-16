import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "@/router/route.utils";

// Layouts
const Root = lazy(() => import("@/layouts/Root"));
const Layout = lazy(() => import("@/components/organisms/Layout"));

// Pages
const Home = lazy(() => import("@/components/pages/Home"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("@/components/pages/OrderHistory"));
const CompareProducts = lazy(() => import("@/components/pages/CompareProducts"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));

const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<div>Loading.....</div>}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

const mainRoutes = [
  createRoute({
    path: "",
    index: true,
    element: <Home />
  }),
  createRoute({
    path: "product/:id",
    element: <ProductDetail />
  }),
  createRoute({
    path: "cart",
    element: <Cart />
  }),
  createRoute({
    path: "checkout",
    element: <Checkout />
  }),
  createRoute({
    path: "login",
    element: <Login />
  }),
  createRoute({
    path: "signup",
    element: <Signup />
  }),
  createRoute({
    path: "order-confirmation/:orderId",
    element: <OrderConfirmation />
  }),
  createRoute({
    path: "orders",
    element: <OrderHistory />
  }),
  createRoute({
    path: "compare",
    element: <CompareProducts />
  }),
  createRoute({
    path: "callback",
    element: <Callback />
  }),
  createRoute({
    path: "error",
    element: <ErrorPage />
  }),
  createRoute({
    path: "reset-password/:appId/:fields",
    element: <ResetPassword />
  }),
  createRoute({
    path: "prompt-password/:appId/:emailAddress/:provider",
    element: <PromptPassword />
  }),
  createRoute({
    path: "*",
    element: <NotFound />
  })
];

const routes = [
  {
    path: "/",
    element: <Suspense fallback={<div>Loading.....</div>}><Root /></Suspense>,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<div>Loading.....</div>}><Layout /></Suspense>,
        children: [...mainRoutes]
      }
    ]
  }
];

export const router = createBrowserRouter(routes);