import React, { useState, useEffect } from "react";
import { BasePage } from ".";
import Metolib from "@fmidev/metolib";
import styled from "styled-components";

const SERVER_URL = "https://opendata.fmi.fi/wfs";
const STORED_QUERY_FORECAST = "fmi::forecast::hirlam::surface::point::multipointcoverage";

const WeatherRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 25px;
`;

const WeatherSingle = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px;
    text-align: center;
    padding: 5px;
    border-radius: 10px;
    background-color: ${(props) => props.backgroundColor || "#e1f5fe"};
`;

const InfoBox = styled.div`
    margin: 20px 0 20px;
`;

const Weather = () => {
    const [forecast, setForecast] = useState([]);
    const parser = new Metolib.WfsRequestParser();

    const handleCallback = (data, err) => {
        if (err) console.log("err", err);
        const fc = [];
        for (let [key, value] of Object.entries(data.locations[0].data)) {
            const label = value.property.label;
            const unit = value.property.unit;
            value.timeValuePairs.map((pair) => {
                const existing = fc.find((f) => f.time === pair.time);
                const labelUnit = label + "-unit";
                if (existing) {
                    existing[label] = pair.value;
                    existing[labelUnit] = unit;
                } else {
                    fc.push({
                        time: pair.time,
                        parsedTime: new Date(pair.time),
                        [label]: pair.value,
                        [labelUnit]: unit,
                    });
                }
            });
        }
        setForecast(fc);
    };

    const getWeather = () => {
        const currTime = new Date();
        parser.getData({
            url: SERVER_URL,
            storedQueryId: STORED_QUERY_FORECAST,
            requestParameter:
                "Temperature,Humidity,WindspeedMS,WindDirection,TotalCloudCover,WeatherSymbol3,Precipitation1h,PrecipitationAmount",
            begin: currTime,
            end: new Date(currTime.getTime() + 12 * 60 * 60 * 1000),
            timestep: 60 * 60 * 1000 * 2,
            sites: ["Helsinki"],
            callback: function (data, errors) {
                handleCallback(data, errors);
            },
        });
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <BasePage>
            <WeatherRow>
                {/* It's not a table O:) */}
                <WeatherSingle backgroundColor="white">
                    <InfoBox>Time</InfoBox>
                    <InfoBox>
                        <div style={{ height: "37px" }}></div>
                    </InfoBox>
                    <InfoBox>Temp °C</InfoBox>
                    <InfoBox>
                        Precip.
                        <br />
                        mm/h
                    </InfoBox>
                    <InfoBox>Humidity %</InfoBox>
                    <InfoBox>Clouds %</InfoBox>
                </WeatherSingle>
                {forecast.map((f) => {
                    return (
                        <WeatherSingle key={f.time}>
                            <InfoBox>
                                <div>{f.parsedTime.getHours()}.00</div>
                            </InfoBox>
                            <InfoBox>
                                <img
                                    src={require("../assets/weather-symbols/" + f.Weather + ".svg")}
                                />
                            </InfoBox>
                            <InfoBox>{f["Air temperature"].toFixed(0)}</InfoBox>
                            <InfoBox>
                                <div>
                                    {f["Precipitation amount 1 hour"]}
                                    <br />
                                    &nbsp;
                                </div>
                            </InfoBox>
                            <InfoBox>
                                <div>{f["Humidity"].toFixed(0)}</div>
                            </InfoBox>
                            <InfoBox>
                                <div>{f["Total cloud cover"].toFixed(0)}</div>
                            </InfoBox>
                        </WeatherSingle>
                    );
                })}
            </WeatherRow>
        </BasePage>
    );
};

export default Weather;

/*
Air temperature: 14.58
Air temperature-unit: "degC"
Humidity: 82.51
Humidity-unit: "%"
Precipitation amount: 0
Precipitation amount 1 hour: 0
Precipitation amount 1 hour-unit: "mm/h"
Precipitation amount-unit: "mm"
Total cloud cover: 30.9
Total cloud cover-unit: "%"
Weather: 1
Weather-unit: "index"
Wind direction: 246
Wind direction-unit: "deg"
Wind speed: 4.23
Wind speed-unit: "m/s"
*/
