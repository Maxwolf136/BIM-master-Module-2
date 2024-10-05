import * as React from "react"
import { ProjectManager } from "../classes/ProjectManager"
import * as Router from "react-router-dom"
import { role, status } from "../classes/Project";

import { TodoCard } from "./ToDoCard"
import { IFCViewer } from "./IFCViewer";


interface Props {
  projectsManager: ProjectManager
}



export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{id}>()
  const [project, setProject] = React.useState(props.projectsManager.getProject(routeParams.id));
  //Assigment M4-C2-L11
  

  props.projectsManager.onProjectUpdated = () => {
    const project = props.projectsManager.getProject(routeParams.id)
    setProject(project)
  
  }

  const onEditprojectBtn = () => {
    const modal = document.getElementById("edit-project-modal");
    if (!(modal instanceof HTMLDialogElement)) {return;}
    modal.showModal();
    
  }
  
  const onCloseBtn = () => {
    const modal = document.getElementById("edit-project-modal");
    if (!(modal instanceof HTMLDialogElement)) {return;}
    modal.close();
    
    React.useState(project)
  }


  console.log("im the ID ma boyts", routeParams.id)
  if(!routeParams.id) {return(<p> Project ID is needed to see this page</p>)} 
  
  if(!project) {return(<p> The Project with ID {routeParams.id} wasn't found.</p>)}
    


    
// onFormSubmit

const onFormSubit = (e: React.FormEvent) => {
  e.preventDefault()
  const projectForm = document.getElementById("edit-project-form")
  if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
  const formData = new FormData(projectForm)
  const projectToUpdate = props.projectsManager.getProject(project.id) 
  
 if(projectToUpdate)  {
    projectToUpdate.name = formData.get("name") as string,
    projectToUpdate.description = formData.get("description") as string,
    projectToUpdate.status =  formData.get("status") as status,
    projectToUpdate.role = formData.get("userrole") as role,
    projectToUpdate.date = new Date(formData.get("finishDate") as string)
  }
  if (!props.projectsManager) {
    console.log("props.projectmanager is undefined")
    return
  }
  try {
    props.projectsManager.updateProject(project)

    //Assigment M4-C2-L11
    setProject({...project});
    projectForm.reset()


    const modal = document.getElementById("edit-project-modal")
    if (!(modal && modal instanceof HTMLDialogElement)) {return}
    modal.close() 
    console.log("Modal closed") // Add this line

  } catch (error) {
    console.log("Error creating project: ", error) // Add this line
    const errorElement = document.getElementById("pop-up-modal") as HTMLElement
    errorElement.style.display = "flex"; // Visar elementet som normalt är dolt
    const closeBtnPopup = document.getElementById("close-pop-up-btn")
    if (closeBtnPopup) {
      closeBtnPopup.addEventListener("click", () => {
      errorElement.style.display = "none"; // släcker ner elementet
    });

    }
  }
}
    
    
    return(
<div className="page" id="project-details" >
<dialog id="edit-project-modal">
    <form onSubmit={(e) => onFormSubit(e)}  id="edit-project-form">
      <h2>Edit Poject</h2>
      <div className="input-list">
        <div className="form-field-container">
          <i className="fa-regular fa-building" />
          <label>Name</label>
          {/*//M2-Assigment Q#3 */}
          <input
            name="name"
            type="text"
            placeholder=" What is the name of your project?"
          />
          <div className="form-field-container">
            <i className="fa-regular fa-rectangle-list" />
            <label>Description</label>
            <textarea
              name="description"
              cols={30}
              rows={5}
              placeholder="give me number"
            />
            <div className="form-field-container" />
            <i className="fa-regular fa-user" />
            <label>Role</label>
            <select name="role">
              <option>Admin</option>
              <option>Manager</option>
              <option>Developer</option>
              <option>Designer</option>
            </select>
            <div className="form-field-container" />
            <i className="fa-regular fa-chart-bar" />
            <label>Status</label>
            <select name="status">
              <option>Pending</option>
              <option>Closed</option>
              <option>Archive</option>
            </select>
            <div className="form-field-container" />
          </div>
        </div>
        <div className="form-field-container" />
        <i className="fa-regular fa-chart-bar" />
        <label>Finish date</label>
        <input name="date" type="date" />
        <div>
          <button onClick={onCloseBtn} id="close-btn" type="button"> Cancel</button>
          <button id="create-btn" type="submit">Update</button>
          <dialog id="pop-up-modal" style={{ display: "none" }}>
            <div id="pop-up-container">
              <h2 className="fa fa-warning">Warning!</h2>
              <p id="Alert-message">Projektet har samma namn</p>
              <button id="close-pop-up-btn" type="button">
                Close
              </button>
            </div>
          </dialog>
        </div>
      </div>
    </form>
  </dialog>
  <header>
    <div>
      <h2 data-project-info="name">{project.name}</h2>
      <p style={{ color: "#969696" }}>{project.description}</p>
    </div>
  </header>
  <div className="main-page-content">
    <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
      <div className="dashboard-card" style={{ padding: "30px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 30px",
            marginBottom: 30
          }}
        >
          <p
            style={{
              fontSize: 20,
              backgroundColor: "#ca8134",
              aspectRatio: 1,
              borderRadius: "100%",
              padding: 12
            }}
          >
           {project.name}
          </p>
          <button onClick={onEditprojectBtn} id="editBtn" className="btn-secondary">
          <span className="material-icon-round">Edit</span>
          </button>
        </div>
        <div style={{ padding: "0 30px" }}>
          <div>
            <h5>{project.name}</h5>
            <p>{project.description}</p>
          </div>
          <div
            style={{
              display: "flex",
              columnGap: 30,
              padding: "30px 0px",
              justifyContent: "space-between"
            }}
          >
            <div>
              <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                Status
              </p>
              <p>Active</p>
            </div>
            <div>
              <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                Cost
              </p>
              <p>$ 2'542.000</p>
            </div>
            <div>
              <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                Role
              </p>
              <p>Engineer</p>
            </div>
            <div>
              <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
              {project.status}
              </p>
              <p>{String(project.date)}</p>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#404040",
              borderRadius: 9999,
              overflow: "auto"
            }}
          >
            <div
              style={{
                width: `${project.progess *100} %`,
                backgroundColor: "darkgrey",
                padding: "4px 0",
                textAlign: "center"
              }}
            >
              {project.progess *100} %
            </div>
          </div>
        </div>
      </div>
      <div>
        <TodoCard/>
      </div>
    </div>
      <IFCViewer/>
  </div>
</div>

    )
}