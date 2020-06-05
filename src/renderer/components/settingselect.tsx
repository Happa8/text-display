import * as React from "react";
import styled from "styled-components";

type Props = {
  name: string;
  title: string;
  value: string;
  valueList: string[];
  description?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  font-size: 0.9rem;
`;

const LabelZone = styled.div`
  width: 200px;
  font-size: 1.2rem;
  color: #d2d2d2;
`;

const Description = styled.p`
  margin: 10px 0;
  color: #e2e2e2;
`;

const Select = styled.select`
  height: 1.3rem;
  width: 200px;
  font-size: 1rem;
  border-radius: 0;
  border: none;
  outline: none;
  color: #e2e2e2;
  background-color: #3c3c3c;
  padding: 5px 10px;
`;

const SettingList: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <LabelZone>{props.title}</LabelZone>
      <Description>{props.description}</Description>
      <Select name={props.name} onChange={props.onChange} size={1}>
        {props.valueList.map((elm) => {
          <option value={elm}>{elm}</option>;
        })}
      </Select>
    </Wrapper>
  );
};

export default SettingList;
