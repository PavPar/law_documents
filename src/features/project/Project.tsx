import React, { useEffect } from "react";
import { Button, Layout } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import { css } from "@emotion/css";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  selectData,
  selectFilePaths,
  selectFiles,
  selectStatus,
  setRootDir,
} from "./slice/slice";
import {
  displayImageByPathThunk,
  getDirectoryTreeThunk,
  openFileDialogThunk,
} from "./slice/thunks";

export function Project() {
  const dispatch = useAppDispatch();

  //   const files = useAppSelector(selectFilePaths);
  const files = useAppSelector(selectFiles);
  const status = useAppSelector(selectStatus);
  const imageData = useAppSelector(selectData);

  useEffect(() => {
    console.log(files);
    console.log(openFileDialogThunk);
  }, [files]);

  useEffect(() => {
    console.log(status);
  }, [status]);

  return (
    <Layout
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
      <Sider width="25%">
        <div
          className={css`
            display: grid;
          `}
        >
          {files?.children?.map((f) => {
            return (
              <Button
                key={f.hash}
                onClick={() => {
                  console.log(f);
                  dispatch(displayImageByPathThunk(f.path));
                }}
              >
                {f.name}
              </Button>
            );
          })}
        </div>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>
          <Button
            onClick={() => {
              dispatch(openFileDialogThunk());
            }}
          >
            открыть папку
          </Button>
          <Button
            onClick={() => {
              dispatch(getDirectoryTreeThunk());
            }}
          >
            открыть папку
          </Button>

          {imageData ? (
            <img
              className={css`
                width: 75vw;
              `}
              src={`data:image/jpg;base64,${imageData}`}
            ></img>
          ) : (
            <div>nothing</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
