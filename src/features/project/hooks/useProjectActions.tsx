const path = window.require("path");

import { useState } from "react";
import { useNavigate } from "react-router";
import { PROJECT_FOLDER_STUCTURE } from "src/app/constants";
import { useAppDispatch, useAppSelector } from "src/app/store";
import {
  openDirDialog,
  openFileOpenDialog,
  copyFiles,
  openProjectOpenDialog,
  writeFile,
} from "../slice/api";
import {
  selectProjectPath,
  selectProjectRootFilePath,
  selectProjectData,
  addItemsToProject,
  setProjectWorkDirPath,
  setProject,
  setProjectRootFilePath,
  setOriginalProject,
} from "../slice/slice";
import { scanForImagesInDirThunk } from "../slice/thunks";
import { ProjectItem } from "../slice/types";
import { ProjectDataTypeGuard } from "../utils/projectDataTypeGuard";
import {
  createProjectStructure,
  imageToProjectStructure,
  getProjectData,
} from "../utils/projectStructureMethods";

export function useProjectActions() {
  const dispatch = useAppDispatch();
  const projectWorkDirPath = useAppSelector(selectProjectPath);
  const projectRootFilePath = useAppSelector(selectProjectRootFilePath);
  const projectData = useAppSelector(selectProjectData);

  async function createProject(projectName: string) {
    //open dir
    const dirDialogRes = await openDirDialog();

    if (dirDialogRes.canceled) {
      throw new Error("canceled");
    }

    const projectPath = dirDialogRes.filePaths[0];

    const { createProjectFileRes } = await createProjectStructure(
      projectPath,
      projectName
    );

    await openProjectFile(createProjectFileRes.fpath);
  }
  async function addFilesToProjectLogic(filePaths: string[]) {
    const cpRes = await copyFiles({
      dest: path.join(projectWorkDirPath, PROJECT_FOLDER_STUCTURE.images),
      files: filePaths,
    });
    console.log(cpRes);
    const items: ProjectItem[] = [];
    const map = cpRes?.newFileNamesMap || {};
    cpRes?.newFilesPaths.forEach((fp) =>
      items.push(
        imageToProjectStructure({
          relativePath: path.relative(projectWorkDirPath, fp),
          name: map[path.basename(fp)],
          uid: path.parse(fp).name,
        })
      )
    );
    // TODO: if item was added and project not saved, the file will exist in folder but not in index file
    dispatch(addItemsToProject(items));
    dispatch(scanForImagesInDirThunk({ dpath: projectWorkDirPath }));
  }

  async function addFilesToProject() {
    const openFileDialogRes = await openFileOpenDialog();
    if (openFileDialogRes.canceled) {
      throw new Error("canceled");
      return;
    }
    await addFilesToProjectLogic(openFileDialogRes.filePaths);
  }

  async function openProject() {
    const openProjectDialogRes = await openProjectOpenDialog();

    if (openProjectDialogRes.canceled) {
      throw new Error("canceled");
      return;
    }

    const projectFilePath = openProjectDialogRes.filePaths[0];
    await openProjectFile(projectFilePath);
  }

  async function openProjectFile(projectFilePath: string) {
    const project = await getProjectData(projectFilePath);

    if (!ProjectDataTypeGuard(project)) {
      throw new Error("typeguard failed");
    }

    dispatch(scanForImagesInDirThunk({ dpath: path.dirname(projectFilePath) }));
    dispatch(setProjectWorkDirPath(path.dirname(projectFilePath)));

    //   dispatch(setProjectItems(project.items));
    dispatch(setProject(project));
    dispatch(setOriginalProject(project));

    dispatch(setProjectRootFilePath(projectFilePath));
    //   dispatch(setProjec)
  }

  async function saveProject() {
    dispatch(setOriginalProject(projectData));
    await writeFile({
      fpath: path.join(projectRootFilePath),
      content: JSON.stringify(projectData),
    });
  }

  return {
    saveProject,
    openProjectFile,
    openProject,
    addFilesToProject,
    createProject,
    addFilesToProjectLogic,
  };
}
