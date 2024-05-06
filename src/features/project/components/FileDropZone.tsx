import { css } from "@emotion/css";
import { useCallback, useState } from "react";
import { useProjectActions } from "../hooks/useProjectActions";
import { useDropzone } from "react-dropzone";
import { ACCEPTED_FILE_TYPES } from "src/app/constants";

export type FileDropZoneProps = {};
export function FileDropZone({}: FileDropZoneProps) {
  const { addFilesToProjectLogic } = useProjectActions();

  const onDrop = (files: File[]) => {
    console.log(files);
    const filePaths: string[] = [];

    if (!files) {
      return;
    }

    for (const file of files) {
      filePaths.push(file.path);
    }

    if (filePaths) {
      addFilesToProjectLogic(filePaths).catch((err) => {
        console.error(err);
      });
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "image/png": ACCEPTED_FILE_TYPES,
    },
  });

  return (
    <div
      {...getRootProps()}
      className={css`
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1000;
      `}
    >
      {isDragActive && (
        <div
          className={css`
            width: 100%;
            height: 100%;
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
            >
              <input {...getInputProps()} />
              Перетащите файлы сюда
            </div>
          }
        </div>
      )}
    </div>
  );
}
