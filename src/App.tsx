import { lazy, Suspense } from "react";
import "./App.css";
const CharacterModel = lazy(() => import("./components/Character/Scene"));
const MainContainer = lazy(() => import("./components/MainContainer"));

import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<div className="fallback-loader">Loading Layout...</div>}>
          <MainContainer>
            <Suspense fallback={null}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;