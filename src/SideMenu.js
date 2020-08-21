import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledMenu = styled.div`
    width: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`;

const StyledLink = styled(Link)`
    background-color: ${props => props.bgcolor || "white"};
    background-image: url(${props => props.bgimg});
    color: ${props => props.color || "black"};
    width: 100px;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    flex: 1;
    text-decoration: none;
`;

const SideMenu = props => (
    <StyledMenu>
        <StyledLink bgcolor={"white"} to="/hsl">
            HSL
        </StyledLink>
        <StyledLink bgcolor={"lightblue"} to="/weather">
            Weather
        </StyledLink>
        <StyledLink bgcolor={"lightgreen"} to="/house">
            House
        </StyledLink>
        <StyledLink bgcolor={"orange"} to="/hue">
            Hue
        </StyledLink>
        <StyledLink bgcolor={"chocolate"} to="/whiskey">
            Whisk(e)y
        </StyledLink>
        <StyledLink bgcolor={"black"} color={"white"} to="/" onClick={() => props.togglePower()}>
            Power
        </StyledLink>
    </StyledMenu>
);

export default SideMenu;
