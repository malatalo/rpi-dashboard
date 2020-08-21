import React from "react";
import { BasePage } from ".";

export default class HouseIOT extends React.Component {
    render() {
        return (
            <BasePage backgroundColor="black">
                <iframe
                    src="http://192.168.1.108:3000/d-solo/wn-QdQkRk/home?orgId=1&panelId=2"
                    width="700"
                    height="480"
                    frameBorder="0"
                ></iframe>
                <iframe
                    src="http://192.168.1.108:3000/d-solo/wn-QdQkRk/home?orgId=1&panelId=3"
                    width="700"
                    height="480"
                    frameBorder="0"
                ></iframe>
            </BasePage>
        );
    }
}
