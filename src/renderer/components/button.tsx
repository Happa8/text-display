import * as React from "react";
import styled from "styled-components";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type Props = {
  iconprops: FontAwesomeIconProps;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

const Wrapper = styled.div`
  width: 20px;
  height: 20px;
  background-color: rgba(100, 100, 100, 0.8);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: none;
  font-size: 10px;
`;

const Button: React.FC<Props> = (props) => {
  return (
    <Wrapper onClick={props.onClick}>
      <FontAwesomeIcon {...props.iconprops} />
    </Wrapper>
  );
};

export default Button;
