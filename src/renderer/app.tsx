import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import GlobalStyle from "./globalstyle";
import { useDropzone } from "react-dropzone";
import { ipcRenderer, remote } from "electron";
import * as localShortcut from "electron-localshortcut";
const dialog = require("electron").remote.dialog;

const container = document.getElementById("app");

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
`;

const Main = styled.main<{ isDataSet: boolean }>`
  margin: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: ${(props) => (props.isDataSet ? "drag" : "none")};

  /* -webkit-user-select: none; */
`;

const DataDropArea = styled.div<{ isDataSet: boolean }>`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.isDataSet ? "none" : "flex")};
  align-items: center;
  justify-content: center;
`;

const TextDisplayArea = styled.div<{ isDataSet: boolean; fontSize: number }>`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.isDataSet ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.fontSize}px;
`;

const App: React.FC = () => {
  const [isDataSet, setIsDataSet] = React.useState<boolean>(false);
  const [dataSet, setDataSet] = React.useState<Array<string>>([]);
  const [currentListNum, setCurrentListNum] = React.useState<number>(0);
  const [nowControll, setNowControll] = React.useState<any>(["", ""]);
  const [fontSize, setFontSize] = React.useState<number>(80);
  const onDrop = React.useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    if (acceptedFiles.length > 1) {
      dialog.showErrorBox("error", "ファイル数が１ではありません");
    } else {
      if (acceptedFiles[0].type == "text/plain") {
        setIsDataSet(true);
        ipcRenderer.send("filepath", acceptedFiles[0].path);
        ipcRenderer.on("filedata", (event, arg) => {
          console.log("received");
          console.log(arg);
          setDataSet(arg);
          setCurrentListNum(0);
        });
      } else {
        dialog.showErrorBox("error", "ファイルタイプがtxtではありません");
      }
    }
  }, []);

  type controller = "next" | "back" | "FontUp" | "FontDown";

  const controlListNum = (arg: controller) => {
    console.log("test1");
    if (isDataSet) {
      switch (arg) {
        case "back":
          console.log("back");
          if (currentListNum > 0) {
            setCurrentListNum(currentListNum - 1);
          }
          break;

        case "next":
          console.log("test");
          if (currentListNum < dataSet.length - 1) {
            setCurrentListNum(currentListNum + 1);
            console.log(currentListNum);
          }
          break;

        case "FontUp":
          setFontSize(fontSize + 2);
          break;

        case "FontDown":
          setFontSize(fontSize - 2);
          break;
      }
    }
  };

  React.useEffect(() => {
    if (isDataSet) {
      controlListNum(nowControll[0]);
    }
    console.log(nowControll);
  }, [nowControll]);

  localShortcut.register(remote.getCurrentWindow(), "Left", () => {
    setNowControll(["back", Math.random()]);
  });

  localShortcut.register(remote.getCurrentWindow(), "Right", () => {
    setNowControll(["next", Math.random()]);
  });

  localShortcut.register(remote.getCurrentWindow(), "Up", () => {
    setNowControll(["FontUp", Math.random()]);
  });

  localShortcut.register(remote.getCurrentWindow(), "Down", () => {
    setNowControll(["FontDown", Math.random()]);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Wrapper>
      <GlobalStyle />
      <Main isDataSet={isDataSet}>
        <DataDropArea isDataSet={isDataSet} {...getRootProps()}>
          {isDragActive ? (
            <p>ファイルをここにドロップ</p>
          ) : (
            <p>ドラッグアンドドロップ/クリックでファイルを追加</p>
          )}
          <input {...getInputProps()} />
        </DataDropArea>
        <TextDisplayArea
          isDataSet={isDataSet}
          fontSize={fontSize}
          onClick={() => {
            console.log(dataSet);
          }}
        >
          {isDataSet ? dataSet[currentListNum] : ""}
        </TextDisplayArea>
      </Main>
    </Wrapper>
  );
};

ReactDOM.render(<App />, container);
