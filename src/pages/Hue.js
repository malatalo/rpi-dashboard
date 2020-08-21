import React, { useState, useEffect } from "react";
import { BasePage } from ".";
import { bridgeIp, username } from "../hueSettings.json";
import styled from "styled-components";

const LightList = styled.div`
  width: 100%;
  height: 100%;
  background-color: #116696;
  display: flex;
  flex-direction: column;
`;

const LightListing = styled.div`
  padding: 38px; /* magic number for my 4 lights */
  margin: 10px;
  background-color: #9fc1d5;
  border-radius: 10px;
  display: flex;
`;

const LightName = styled.div`
  width: 200px;
`;

const LightSwitch = styled.div`
  width: 200px;
`;

const Light = ({ light }) => {
  return (
    <LightListing>
      <LightName>{light.name}</LightName>
      <LightSwitch>Toggle switch</LightSwitch>
      {light.type !== "On/Off plug-in unit" ? (
        <>
          <input type="color" />
          <input type="range" />
        </>
      ) : (
        <div>colorz</div>
      )}
    </LightListing>
  );
};

const Hue = () => {
  const [lights, setLights] = useState();

  useEffect(() => {
    const getLights = async () => {
      const lightsResp = await fetch(
        `http://${bridgeIp}/api/${username}/lights`
      )
        .then((resp) => resp.json())
        .then((resp) => Object.values(resp));
      setLights(lightsResp);
    };
    getLights();
  }, []);

  return (
    <BasePage>
      <LightList>
        {lights &&
          lights.map((light) => <Light key={light.name} light={light} />)}
      </LightList>
    </BasePage>
  );
};

export default Hue;
