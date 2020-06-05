import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import GlobalStyle from "./globalstyle";
import { ipcRenderer, remote } from "electron";
import { library } from "@fortawesome/fontawesome-svg-core";
// import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

// TODO: font-managerがNode12に対応したら導入して、プルダウン方式でフォントを選べるようにする。
// import * as FontManager from "font-scanner";

const Store = require("electron-store");
const store = new Store();

import List from "./components/settinglist";
import Select from "./components/settingselect";

library.add(fas);

const container = document.getElementById("app");

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  padding: 30px;
  box-sizing: border-box;
  background-color: #252424;
`;

const App: React.FC = () => {
  const [textColor, setTextColor] = useState(store.get("textColor", "#000000"));
  const [bgColor, setBgColor] = useState(store.get("bgColor", "#ffffff"));
  const [font, setFont] = useState(store.get("font", "inherit"));

  // const fonts = FontManager.getAvailableFontsSync();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case "textcolor":
        setTextColor(event.target.value);
        console.log(textColor);
        break;
      case "bgcolor":
        setBgColor(event.target.value);
        break;
      case "font":
        setFont(event.target.value);
        break;
    }
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.name) {
      case "font":
        setFont(event.target.value);
        console.log(font);
        break;
    }
  };

  const saveSetting = () => {
    store.set("textColor", textColor);
    store.set("bgColor", bgColor);
    store.set("font", font);
    ipcRenderer.send("setSetting");
  };

  return (
    <Wrapper>
      <GlobalStyle />
      <List
        title="文字色"
        description="文字の色を#付きのカラーコードで入力"
        value={textColor}
        name="textcolor"
        onChange={handleChange}
      />
      <List
        title="背景色"
        description="背景の色を#付きのカラーコードで入力"
        value={bgColor}
        name="bgcolor"
        onChange={handleChange}
      />
      <List
        title="フォント"
        description="フォント名を入力"
        value={font}
        name="font"
        onChange={handleChange}
      />
      <button
        onClick={() => {
          saveSetting();
        }}
      >
        Save
      </button>
    </Wrapper>
  );
};

ReactDOM.render(<App />, container);
