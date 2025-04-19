// import React from "react";
// import { useRoutes } from "react-router-dom";

// const AppRoutes = () => {
//     const routes = useRoutes([
//         { path: "/", element: <Home /> },
//         // { path: "/login", element: <About /> },
//     ]);

//     return routes;
// };

// export default AppRoutes;

// interface Router {
//   pathname: string;
//   searchParams: URLSearchParams,
//   navigate: (path: string | URL) => void,
// }

// function useRouter(initialPath: string): Router {
//   const [pathname, setPathname] = React.useState(initialPath);

//   const router = React.useMemo(() => {
//     return {
//       pathname,
//       searchParams: new URLSearchParams(),
//       navigate: (path: string | URL) => setPathname(String(path)),
//     };
//   }, [pathname]);

//   return router;
// }

// export {useRouter}
// export type {Router};
