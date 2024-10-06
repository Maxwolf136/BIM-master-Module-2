import * as React from "react";
import {IProject , Project, role, status } from "../classes/Project";
import { ProjectManager } from "../classes/ProjectManager";
import { ProjectCard } from "./ProjectCard";
import * as Router from "react-router-dom"
import {SearchBox} from "./SearchBox"
import * as Firestore from "firebase/firestore"
import { firestoreDB, getCollection } from "../firebase";

interface Props {
  projectsManager: ProjectManager
}

const projecCollection = getCollection<IProject>("/projects")

export function ProjectPage(props:Props) {

  const [projectsManager] = React.useState(new ProjectManager())
  const [project, setProjects] = React.useState<Project[]>(props.projectsManager.list)

  props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}
  props.projectsManager.onProjectUpdated = () => {setProjects([...props.projectsManager.list])}
  
  const getFirestoreProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projecCollection)
    for ( const doc of firebaseProjects.docs) {
      const data  = doc.data()
      const project: IProject = {
        ...data,
        date:(data.date as unknown as Firestore.Timestamp).toDate()
      }

      try {
        props.projectsManager.newProject(project, doc.id)
      } catch (error) {
        console.error("Error adding new project:", error)
      }
    };
  }

  React.useEffect(() => {
    getFirestoreProjects()
  }, [])

  const projectCards = project.map((project) => {
   return (
    <Router.Link to={`/project/${project.id}`} key={project.id}>
      <ProjectCard project={project} />
    </Router.Link>  
  )
  })

//instance gör behöver en ny key id för varje ny state

  React.useEffect(() => {console.log("project statsse: ", project)}, [project])


  const onimportBtnClick = ()=> {
    const importBtn = document.getElementById("import-btn")
    console.log("hej")
    if (!(importBtn instanceof HTMLButtonElement)) {return}
      importBtn.addEventListener("click", () => { 
        props.projectsManager.importJSON()
        console.log("hej")
  })
  }


  const onexportBtnClick = () => {
    const exportBtn = document.getElementById("export-btn")
    if (!(exportBtn instanceof HTMLButtonElement)) {return}
        exportBtn.addEventListener("click", () => { 
          props.projectsManager.exportJSON()
  })
  }


  const onnewProjectBtnClick = () => {
    const modal = document.getElementById("new-project-modal");
    if (!(modal instanceof HTMLDialogElement)) {return;}
    modal.showModal();

  }





// onFormSubmit!!!!!!!!!
const onFormSubit = (e: React.FormEvent) => {
  e.preventDefault()
  const projectForm = document.getElementById("new-project-form")
 
  if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
  const formData = new FormData(projectForm)
  const projectData: IProject = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as status,
    role: formData.get("userRole") as role,
    date: new Date(formData.get("finishDate") as string),
  }

    if (!props.projectsManager) {
      console.log("props.projectmanager is undefined") 
      return;
    }

  try {
    Firestore.addDoc(projecCollection, projectData)
    projectForm.reset()
    const modal = document.getElementById("new-project-modal")
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

const onProjectSearch = (value:string) => {
  setProjects(props.projectsManager.filterProjects(value))
}


return(
<div className="page" id="project-page" style={{ display: "flex" }}>
  <dialog id="new-project-modal">
    <form onSubmit={(e) => onFormSubit(e)}  id="new-project-form">
      <h2>New Poject</h2>
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
          <button id="close-btn" type="button"> Cancel</button>
          <button id="create-btn" type="submit">Create</button>
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
  <header id="page-header">
    <h1>Project Managment</h1>
    <SearchBox onChange={(value) =>onProjectSearch(value)}/>
    <div>
      <button onClick={onnewProjectBtnClick} id="new-project-btn" className="ion:print-sharp" >
        <div className="fa-regular fa-building"> create new Project</div>
      </button>
      <button onClick={onimportBtnClick} id="new-project-btn" className="ion:print-sharp" >
        <div className="fa-regular fa-building"> IMPORT</div>
      </button>
      <button onClick={onexportBtnClick} id="new-project-btn" className="ion:print-sharp" >
        <div className="fa-regular fa-building"> EXPORT</div>
      </button>
    </div>
  </header>
  {
    project.length > 0 ? <div id="project-list">{projectCards}</div> : <p> hittar inga projekt!</p>
  }
</div>

    )
}