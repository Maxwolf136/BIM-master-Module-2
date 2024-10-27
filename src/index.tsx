import * as THREE from "three"
import * as OBC from "openbim-components"
import * as Router from "react-router-dom"
import { ProjectManager } from "./classes/ProjectManager"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage"
import *  as BUI from "@thatopen/ui";
import * as React from "react"
import * as ReactDOM from "react-dom/client";
import { Sidebar } from "./react-components/Sidebar"
import { ProjectPage } from "./react-components/ProjectPage"
import { ViewerProvider } from "./react-components/IFCViewer"
import {UserPage} from "./react-components/UsersPage";

BUI.Manager.init()
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "bim-grid": any;
            "bim-label": any;
            "bim-button": any
            "bim-viewport": any
        }
     }
    }
    
const projectsManager = new ProjectManager()

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
    <Router.BrowserRouter>
        <ViewerProvider>
            <Sidebar/>
            <Router.Routes>
            <Router.Route path="/" element={<ProjectPage projectsManager={projectsManager}/>}></Router.Route>
                <Router.Route path="/project/:id" element ={<ProjectDetailsPage projectsManager={projectsManager}/>}></Router.Route>
                <Router.Route path="/users" element ={<UserPage />}></Router.Route>
            </Router.Routes>
        </ViewerProvider>
    </Router.BrowserRouter>
 </>
)

