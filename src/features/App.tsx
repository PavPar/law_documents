import React from "react";
import { Files } from "./files/Files";
import { Project } from "./project/Project";
import { Route, Routes } from "react-router";
import { MainPage } from "./mainPage/MainPage";

export enum APP_PAGES_PATHS {
  main = "/",
  project = "/project",
}

export function App() {
  return (
    <Routes>
      <Route path={APP_PAGES_PATHS.main} element={<MainPage />} />
      <Route path={APP_PAGES_PATHS.project} element={<Project />} />
      <Route path={"*"} element={<MainPage />} />
    </Routes>
  );
}
