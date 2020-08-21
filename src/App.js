import React from "react";
import SideMenu from "./SideMenu";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HSL, Hue, Whiskey, Weather, HouseIOT } from "./pages";

const AppContainer = styled.div`
    height: 480px;
    width: 800px;
    display: flex;
    flex-direction: row;
    background-color: #fff;
    box-shadow: 0 0 100px white;
`;

const StyledPage = styled.div`
    width: 100%;
    height: 100%;
`;

const StyledOff = styled.div`
    height: 480px;
    width: 800px;
    background-color: black;
    box-shadow: 0 0 100px white;
`;

export default class App extends React.Component {
    constructor() {
        super();
        this.state = { power: true };
        this.togglePower = this.togglePower.bind(this);
    }

    togglePower = () => {
        this.setState({ power: !this.state.power });
    };

    render() {
        return !this.state.power ? (
            <StyledOff onClick={() => this.togglePower()}></StyledOff>
        ) : (
            <Router>
                <AppContainer>
                    <SideMenu togglePower={this.togglePower} />
                    <Switch>
                        <Route path="/hsl" component={HSL} />
                        <Route path="/weather" component={Weather} />
                        <Route path="/house" component={HouseIOT} />
                        <Route path="/hue" component={Hue} />
                        <Route path="/whiskey" component={Whiskey} />
                        <Route path="/">
                            <StyledPage>home</StyledPage>
                        </Route>
                    </Switch>
                </AppContainer>
            </Router>
        );
    }
}
