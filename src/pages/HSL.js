import React, { useEffect, useState } from "react";
import { BasePage } from ".";
import getStopTimes from "../util/hslTimes";
import styled from "styled-components";
import {
  TramIcon,
  BusIcon,
  NavIcon,
  CloseIcon,
  ExpandIcon,
} from "../assets/icons";
import Expand from "../components/expand";
import QRCode from "qrcode.react";

const HSL = () => {
  const [stopTimes, setStopTimes] = useState();
  const [modalData, setModalData] = useState();

  useEffect(() => {
    const getSetTimes = async () => {
      const asd = await getStopTimes();
      setStopTimes(asd);
    };
    getSetTimes();
  }, []);

  const renderStopTimes = (stopTimes) => {
    return stopTimes.map((st, i) => {
      return (
        <TimeRow
          key={i}
          onClick={() => {
            setModalData(st);
          }}
        >
          <FlexRow>
            <VehicleText underline={st.real}>
              {st.real ? st.parsedReal : st.parsedScheduled}
            </VehicleText>
            <Icon vehicle={st.vehicle} alerts={st.alerts} />
            <VehicleText>{st.shortName}</VehicleText>
          </FlexRow>
        </TimeRow>
      );
    });
  };

  return (
    <BasePage>
      <Clock>{getTime()}</Clock>
      {stopTimes ? (
        <FlexRow>
          <FlexColumn>
            <TimeRow>
              <IconDiv center style={{ transform: "rotate(135deg)" }}>
                <NavIcon />
              </IconDiv>
            </TimeRow>
            {renderStopTimes(stopTimes.H0654)}
          </FlexColumn>
          <FlexColumn>
            <TimeRow>
              <IconDiv center style={{ transform: "rotate(-45deg)" }}>
                <NavIcon />
              </IconDiv>
            </TimeRow>
            {renderStopTimes(stopTimes.H0655)}
          </FlexColumn>
        </FlexRow>
      ) : (
        <div>Loading...</div>
      )}
      {modalData && (
        <Cover onClick={() => {}}>
          <ModalContent>
            <CloseBox onClick={() => setModalData()}>
              <CloseIcon />
            </CloseBox>
            <Clock style={{ margin: "10px" }}>{modalData.shortName}</Clock>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              {modalData.headsign}
            </div>
            <GridDiv>
              <div>Scheduled time: </div>
              <div style={{ color: "green", fontWeight: "bold" }}>
                {modalData.parsedScheduled}
              </div>
              <div>Real time: </div>
              <div style={{ color: "blue", fontWeight: "bold" }}>
                {modalData.parsedReal}
              </div>
            </GridDiv>
            {modalData.alerts.map((alert, i) => renderAlert(alert, i))}
          </ModalContent>
        </Cover>
      )}
    </BasePage>
  );
};

export default HSL;

const Icon = ({ vehicle, alerts }) => {
  return (
    <IconDiv>
      {vehicle === "TRAM" ? <TramIcon /> : <BusIcon />}
      {alerts.length > 0 && <div>&nbsp;!</div>}
    </IconDiv>
  );
};

const getTime = () => {
  const d = new Date();
  return `${d
    .getHours()
    .toString()
    .padStart(2, "0")}.${d.getMinutes().toString().padStart(2, "0")}`;
};

const renderAlert = (alert, i) => {
  const sd = new Date(alert.effectiveStartDate * 1000);
  const ed = new Date(alert.effectiveEndDate * 1000);
  return (
    <Expand title={alert.alertHeaderText} key={alert.alertHeaderText}>
      <AlertInfo>
        <div style={{width: "345px"}}>{alert.alertDescriptionText}</div>
        <a style={{color:"black", width: "345px", wordBreak: "break-all"}} href={alert.alertUrl}>{alert.alertUrl}</a>
        <div style={{margin: "auto"}}>
        <QRCode value={alert.alertUrl} bgColor="#ffe97d" size={200} />
        </div>
        <div style={{width: "345px"}}>
          <div>{`Start: ${sd.getDate()}.${sd.getMonth()}.${sd.getFullYear()} ${sd.getHours()}.${sd.getMinutes()}`}</div>
          <div>{`End: ${ed.getDate()}.${ed.getMonth()}.${ed.getFullYear()} ${ed.getHours()}.${ed.getMinutes()}`}</div>
        </div>
      </AlertInfo>
    </Expand>
  );
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: auto;
  align-items: center;
`;

const IconDiv = styled.div`
  height: 25px;
  width: 30px;
  margin: ${({ center }) => (center ? "0 auto" : "0 10px")};
  display: flex;
`;

const TimeRow = styled.div`
  width: 150px;
  margin: 15px;
  cursor: pointer;
`;

const VehicleText = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-decoration: ${({ underline }) => underline && "underline"};
`;

const Clock = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 30px;
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  left: 100px;
  width: 700px;
  height: 480px;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
`;

const ModalContent = styled.div`
  margin: auto;
  height: 400px;
  width: 400px;
  background-color: white;
  overflow: auto;
  padding: 40px;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const CodeBlock = styled.pre`
  background-color: #ffe97d;
  padding: 5px;
  margin: 0;
`;

const CloseBox = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  margin: 15px;
  cursor: pointer;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: 150px 50px;
  justify-content: center;
  margin: 30px;
`;

const AlertInfo = styled.div`
  display: grid;
  grid-gap: 15px;
`;
