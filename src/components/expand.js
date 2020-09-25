import React, { useState } from "react";
import { ExpandIcon } from "../assets/icons";
import styled from "styled-components";

const Expand = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ margin: "10px" }}>
      <InnerDiv onClick={() => setOpen(!open)}>
        <ExpandIcon rotate={open} />
        <Title>{title}</Title>
      </InnerDiv>
      <Content open={open}>
        {open && children}
      </Content>
    </div>
  );
};

const InnerDiv = styled.div`
  background-color: #ffb74d;
  display: flex;
  cursor: pointer;
  user-select: none;
`;

const Title = styled.div`
  margin: auto 15px;
`;

const Content = styled.div`
  padding: ${({open}) => open && "10px"};
  background-color: #ffe97d;
`;

export default Expand;
