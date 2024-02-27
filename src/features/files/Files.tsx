// export type FilesProps = {};
// https://copyprogramming.com/howto/how-to-read-a-local-file-in-javascript-running-from-an-electron-app
// https://jaketrent.com/post/select-directory-in-electron/
// https://stackoverflow.com/questions/38400685/how-to-select-file-on-fs-with-react-and-electron

import { Button, Form, Input, Typography } from "antd";
import { Content } from "antd/es/layout/layout";

import React, { useEffect, useState } from "react";

const fs = window.require("fs");
const path = window.require("path");
const { ipcRenderer } = window.require("electron");
const { Title } = Typography;

export function Files() {
  //   const [path, setPath] = useState<string | undefined>("./");
  const [files, setFiles] = useState<string[]>([]);
  const [src, setSrc] = useState<string>([]);
  //   useEffect(() => {
  //     //TODO: types
  //     // if (!path) {
  //     //   console.log("damn");
  //     //   return;
  //     // }
  //     fs.readdir(path, {}, (err: unknown, files: unknown[]) => {
  //       console.log(err, files);
  //       //   setFiles(files);
  //     });
  //   }, [path]);

  return (
    <div>
      <Title>Поиск файлов и их анализ</Title>
      <Content>
        <Form
          onFinish={(values) => {
            // setPath(values?.path);
            console.log(values);
            console.log(values.file?.path);
            console.log(values.file?.value);
            fs.appendFile(
              "test.json",
              JSON.stringify(values["file"]?.path),
              function (err: any) {
                if (err) throw err;
                console.log("Saved!");
              }
            );
          }}
        >
          <Form.Item label="путь" name={"path"}>
            <Input />
          </Form.Item>
          <Form.Item label="путь v2" name={"file"}>
            <Input type="file" />
          </Form.Item>
          <Button htmlType="submit">look</Button>
          <Button
            onClick={() => {
              ipcRenderer
                .invoke("file-dialog")
                .then((result: Electron.OpenDialogReturnValue) => {
                  console.log(result.filePaths);
                  setFiles(result.filePaths);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
          >
            open dialog
          </Button>
          <Button
            onClick={() => {
              fs.mkdir("./test", (err: any) => {
                console.error(err);
              });
              files.forEach((filePath, idx) => {
                fs.copyFile(
                  filePath,
                  path.join("./test", path.basename(filePath)),
                  (err: any) => {
                    console.error(err);
                  }
                );
              });
            }}
          >
            create file copy
          </Button>
          <Button
            onClick={() => {
              ipcRenderer
                .invoke("image-display")
                .then((res) => {
                  console.log(res);
                  setSrc(`data:image/jpg;base64,${res}`);
                })
                .catch((err) => console.error(err));
            }}
          >
            load and display image
          </Button>
        </Form>
        {(files || []).map((fName: string) => {
          return (
            <div>
              <div>{fName}</div>
            </div>
          );
        })}
        <img src={src}></img>
      </Content>
    </div>
  );
}
