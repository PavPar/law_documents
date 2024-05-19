import { useAppSelector } from "src/app/store";
import { selectOriginalProjectData, selectProjectData } from "../slice/slice";
import { useEffect, useState } from "react";

export function useProjectStatusObserver() {
  const projectData = useAppSelector(selectProjectData);
  const originalProjectData = useAppSelector(selectOriginalProjectData);
  const [projectHasData, setProjectHasData] = useState(false);
  const [projectWasChanged, setProjectWasChanged] = useState(false);

  useEffect(() => {
    setProjectHasData(!!projectData);

    if (projectData) {
      setProjectWasChanged(
        JSON.stringify(projectData) !== JSON.stringify(originalProjectData)
      );
    }
  }, [projectData, originalProjectData]);

  return { projectHasData, projectWasChanged };
}
