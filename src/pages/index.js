import HSL from './HSL';
import Hue from './Hue';
import Whiskey from './Whiskey';
import Weather from './Weather';
import HouseIOT from './HouseIOT';
import styled from "styled-components";

const BasePage = styled.div`
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: ${props => props.backgroundColor}
`;

export { BasePage, HSL, Hue, Whiskey, Weather, HouseIOT };