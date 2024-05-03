import { css } from "@emotion/css";
import { useState } from "react";
import { useProjectActions } from "../hooks/useProjectActions";

export type FileDropZoneProps = {};
export function FileDropZone({}: FileDropZoneProps) {
  //   const [isVisible, setIsVisible] = useState(false);
  const { addFilesToProjectLogic } = useProjectActions();
  return (
    <div
      className={css`
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
      `}
    >
      {
        <div
          className={css`
            border: 2px white dashed;
            border-radius: 5px;
            width: 75%;
            height: 75%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            color: white;
          `}
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();

            const files = e.dataTransfer.files;
            const filePaths: string[] = [];

            if (!files) {
              return;
            }

            for (const file of files) {
              //TODO: exclude non images
              filePaths.push(file.path);
            }

            if (filePaths) {
              addFilesToProjectLogic(filePaths).catch((err) => {
                console.error(err);
              });
            }
            onDropCBEnd();
            // setIsVisible(false);
          }}
        >
          Перетащите файлы сюда
        </div>
      }
    </div>
  );
}
