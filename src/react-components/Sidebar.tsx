import * as React from "react";
import * as Router from "react-router-dom"
import { ViewerContext } from "./IFCViewer";
import { TodoCreator } from "../bim-components/ToDoCreator";
import { Components } from "openbim-components";
import { TodoCard } from "./ToDoCard";

export function Sidebar() {
const {viewer } =  React.useContext(ViewerContext)

const createTodo = async () => {
    if(!viewer) {
        console.error("Viewer is not initialized");
        return;
    }
    try {
        const todoCreator = await viewer.tools.get(TodoCreator);
        if(!todoCreator) {
            console.error("TodoCreator tool is not available");
            return;
        }
        todoCreator.addTodo("hej", "Low");
    } catch (error) {
        console.error("Error fetching TodoCreator tool: ", error);
    }
}


return (
    <aside id="sidebar">
        <img id="company-logo" src="./assets/Company-logo.svg" alt=""/>
            <ul id="nav-buttons">
                <Router.Link to="/">
                <bim-button id="homebtn" icon="material-symbols:home" label="HOME">  
                </bim-button>
                </Router.Link>
                <Router.Link to="/project">
                <bim-button id="nav-buttons" icon="material-symbols:dashboard" label="DASHBOARD">
                </bim-button>
                </Router.Link>
                <Router.Link to="/users">
                <bim-button id="nav-buttons" icon="ic:baseline-people" label="PEOPLE">
                        <bim-label icon="material-icon-round"></bim-label>
                </bim-button>
                </Router.Link>
                <bim-button id="nav-buttons" icon="iconoir:pc-check" label="check">
                        <bim-label icon="material-icon-round"></bim-label>
                </bim-button>
            </ul>
    </aside>
 )
}