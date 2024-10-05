import * as React from "react";
import { Project } from "../classes/Project";

interface Props {
    project: Project
}

export function ProjectCard (props: Props) {
    return (
        <div id="project-card" style={{display: "flex"}}>
            <div className="card-header">
            <bim-label style={{ backgroundColor: "${randomColor}", padding: 10, borderRadius: 8, aspectRatio: 1}}>{props.project.name.slice(0,2)}</bim-label>
            <div>
                <bim-label style= {{fontSize: "20px", color: "white", fontweight: "bold"}}
                > {props.project.name} </bim-label>
                <bim-label>{props.project.description}</bim-label>
            </div>
            <div className="card-content">
                <div className="card-property">
                    <bim-label>STATUS</bim-label>
                    <bim-label>{props.project.status}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label>Kostnad</bim-label>
                    <bim-label>{props.project.cost}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label>{props.project.progess *100}*%</bim-label>
                </div>
            </div>
            
            </div>
        </div>

    )
}