import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import GlobalStyle from "./globalstyle";
import { useDropzone } from "react-dropzone";
import { ipcRenderer, remote } from "electron";
import * as localShortcut from "electron-localshortcut";
import { library } from "@fortawesome/fontawesome-svg-core";
// import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
const dialog = require("electron").remote.dialog;

const Store = require("electron-store");
import Button from "./components/button";

library.add(fas);

const store = new Store();

const container = document.getElementById("app");

const Buttons = styled.div`
  z-index: 1;
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0;
  transition-duration: 200ms;
  display: flex;
  width: 100px;
  height: 20px;
  -webkit-app-region: none;
  div {
    margin-right: 10px;
  }
  &:hover {
    opacity: 1;
    transition-duration: 200ms;
  }
`;

const Wrapper = styled.div<{ backgroundColor: string }>`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${(props) => props.backgroundColor};
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
  z-index: 0;
`;

const TextDisplayArea = styled.div<{
  isDataSet: boolean;
  fontSize: number;
  textColor: string;
  fontFamily: string;
}>`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.isDataSet ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.fontSize}px;
  z-index: 0;
  color: ${(props) => props.textColor};
  font-family: ${(props) => props.fontFamily};
`;

const App: React.FC = () => {
  const [isDataSet, setIsDataSet] = React.useState<boolean>(false);
  const [dataSet, setDataSet] = React.useState<Array<string>>([]);
  const [currentListNum, setCurrentListNum] = React.useState<number>(0);
  const [nowControll, setNowControll] = React.useState<any>(["", ""]);
  const [fontSize, setFontSize] = React.useState<number>(80);
  const [bgColor, setBgColor] = React.useState(store.get("bgColor", "#f1f1f1"));
  const [textColor, setTextColor] = React.useState(
    store.get("textColor", "#000000")
  );
  const [font, setFont] = React.useState(store.get("font", "inherit"));
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

  ipcRenderer.on("reload", (event, arg) => {
    console.log("reload");
    switch (arg) {
      case "setting":
        setBgColor(store.get("bgColor", "#f1f1f1"));
        setTextColor(store.get("textColor", "#000000"));
        setFont(store.get("font", "inherit"));
        break;
    }
  });

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

  const resetData = () => {
    setDataSet([]);
    setCurrentListNum(0);
    setIsDataSet(false);
  };

  const openSettingWindow = () => {
    ipcRenderer.send("opensetting");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Wrapper backgroundColor={bgColor}>
      <GlobalStyle />
      <Main isDataSet={isDataSet}>
        <Buttons>
          <Button
            iconprops={{ icon: ["fas", "redo-alt"], color: "#ffffff" }}
            onClick={() => {
              console.log("onclicked");
              resetData();
            }}
          />
          <Button
            iconprops={{ icon: ["fas", "redo-alt"], color: "#ffffff" }}
            onClick={() => {
              console.log("onclicked");
              openSettingWindow();
            }}
          />
        </Buttons>
        <DataDropArea isDataSet={isDataSet} {...getRootProps()}>
          {isDragActive ? (
            <p>ファイルをここにドロップ</p>
          ) : (
            <p>ドラッグアンドドロップ/クリックでファイルを追加</p>
          )}
          <input {...getInputProps()} />
        </DataDropArea>
        <TextDisplayArea
          fontFamily={font}
          textColor={textColor}
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
