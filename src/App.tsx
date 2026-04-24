import { lazy, Suspense } from "react";
import "./App.css";

// সঠিক lazy import পদ্ধতি (যদি Scene.tsx এ ডিফল্ট এক্সপোর্ট থাকে)
const CharacterModel = lazy(() => import("./components/Character/Scene")); // পাথটি নিশ্চিত করুন
const MainContainer = lazy(() => import("./components/MainContainer"));

import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        {/* Suspense এ অবশ্যই একটি fallback দিতে হয়, নাহলে হোয়াইট স্ক্রিন দেখাবে */}
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