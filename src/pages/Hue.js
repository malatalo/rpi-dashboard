import React, { useState, useEffect } from "react";
import { BasePage } from ".";
import { bridgeIp, username } from "../hueSettings.json";
import styled from "styled-components";
import Switch from "react-switch";
import { hexToHSL, HSLToHex } from "../util/colors";

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

const Light = ({ light, toggleLight, color, setColor, id }) => {
  const [currColor, setCurrColor] = useState("");

  useEffect(() => {
    if (!isNaN(color.hue)) {
      const hexCol = HSLToHex(
        (color.hue / 65535) * 360,
        color.sat / 254,
        color.bri / 254
      );
      setCurrColor(hexCol);
    }
  }, []);

  const handleColorChange = (c) => {
    setCurrColor(c);
    setColor(c, id);
  };

  return (
    <LightListing>
      <LightName>{light.name}</LightName>
      <LightSwitch>
        <Switch onChange={() => toggleLight(id)} checked={light.state.on} />
      </LightSwitch>
      {light.type !== "On/Off plug-in unit" && (
        <input
          type="color"
          onChange={(e) => handleColorChange(e.target.value)}
          value={currColor}
        />
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

  const updateLightState = (i, body) => {
    fetch(`http://${bridgeIp}/api/${username}/lights/${i + 1}/state`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  };

  const toggleLight = (i) => {
    const lightsCopy = [...lights];
    const body = { on: !lightsCopy[i].state.on };
    updateLightState(i, body);
    lightsCopy[i].state.on = body.on;
    setLights(lightsCopy);
  };

  const setColor = (hex, i) => {
    const hsl = hexToHSL(hex);
    updateLightState(i, hsl);
  };

  return (
    <BasePage>
      <LightList>
        {lights &&
          lights.map((light, i) => (
            <Light
              key={light.name}
              id={i}
              toggleLight={toggleLight}
              setColor={setColor}
              color={{
                hue: light.state.hue,
                sat: light.state.sat,
                bri: light.state.bri,
              }}
              light={light}
            />
          ))}
      </LightList>
    </BasePage>
  );
};

export default Hue;
