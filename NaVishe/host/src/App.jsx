import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";

const RemoteLogin = lazy(() => import("mf_login/Login"));

const App = () => (
  <ErrorBoundary
    fallback={<div>Something went wrong loading the remote module.</div>}
  >
    <Suspense fallback={<div>Loading...</div>}>
      <RemoteLogin />
    </Suspense>
  </ErrorBoundary>
);

export default App;