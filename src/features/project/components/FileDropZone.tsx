import { css } from "@emotion/css";
import { useCallback, useState } from "react";
import { useProjectActions } from "../hooks/useProjectActions";
import { useDropzone } from "react-dropzone";
import { ACCEPTED_FILE_TYPES, NOTIFICATION_MESSAGES } from "src/app/constants";
import { useNotification } from "../hooks/useNotification";
import { Button } from "antd";
export type FileDropZoneProps = {};

export function FileDropZone({}: FileDropZoneProps) {
  const { addFilesToProjectLogic, addFilesToProject } = useProjectActions();
  const [notificationContext, notify] = useNotification();
  const [isFileBeingAdded, setFileBeingAdded] = useState(false);
  const onDrop = (files: File[]) => {
    setFileBeingAdded(true);
    const filePaths: string[] = [];

    if (!files) {
      return;
    }

    for (const file of files) {
      filePaths.push(file.path);
    }

    if (filePaths) {
      addFilesToProjectLogic(filePaths)
        .then(() => {
          notify("success", NOTIFICATION_MESSAGES.fileAddSuccess);
        })
        .catch((err) => {
          notify("success", NOTIFICATION_MESSAGES.fileAddFail);
          console.error(err);
        })
        .finally(() => {
          setFileBeingAdded(false);
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
        border: 2px black dashed;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 25vw;
        min-height: 25vh;
        flex-direction: column;
      `}
    >
      {notificationContext}
      <input
        {...getInputProps()}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
      {isFileBeingAdded ? "Файлы добавляются" : "Перетащите файлы сюда"}
      <Button
        onClick={() => {
          addFilesToProject()
            .then(() => {
              notify("success", NOTIFICATION_MESSAGES.fileAddSuccess);
            })
            .catch((err) => {
              notify("success", NOTIFICATION_MESSAGES.fileAddFail);
              console.error(err);
            })
            .finally(() => {
              setFileBeingAdded(false);
            });
        }}
      >
        Выбрать файлы
      </Button>
    </div>
  );
}
