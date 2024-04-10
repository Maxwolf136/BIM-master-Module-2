import * as THREE from "three"
import { IProject, Project, role, status } from "./classes/Project"
import { ProjectManager } from "./classes/ProjectManager"
import { closeModal, showModal, toggleModal, } from "./classes/Modal"
import { Container } from "postcss"

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"


const projectlistUI = document.getElementById("project-list") as HTMLDivElement
const projectManager = new ProjectManager(projectlistUI)

// KLickar på knappen "New Project" och skapar en ny div med klassen "project" 
const newProjectBtn= document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("No new project button found")
}





 /*KLickar på knappen "New Project" och skapar en ny div med klassen "project" 
const closeBtn=document.getElementById("close-btn")
if (closeBtn) {
    closeBtn.addEventListener("click", () => {closeModal("new-project-modal")})
} else {
    console.warn("No new closed button found")
}
*/
/*
function nameLength(){
    const nameInput = document.getElementById("name") as HTMLInputElement
    if (nameInput.value.length > 5) {
        return false
        console.warn("Name length is greater than 5 letters");
    }
}
*/

const projectForm = document.getElementById("new-project-form")

if(projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (event) => {
        event.preventDefault() // förhindrar att sidan laddas om
        const formData = new FormData(projectForm) // skapar en ny instans av FormData
        const projectProperty: IProject = { // skapar en ny variabel med objektet
            description: formData.get("description") as string, // hämtar värdet från inputfälten
            name: formData.get("name") as string,  // hämtar värdet från inputfälten
            role: formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            status: formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            date: new Date (formData.get("date") as string) //
        }
        
 
try {
    const project = projectManager.newProject(projectProperty) // skapar en ny variabel som är av typen projectManager och kallar på metoden newProject
   // nameLength()
    projectForm.reset() // rensar inputfälten
    toggleModal ("new-project-modal")
    console.log(project)



    } catch (error) {
       const errorElement = document.getElementById("pop-up-modal") as HTMLElement
        //errorElement.innerHTML  // skapar en ny div med innehåll enligt "pop-up-modal elementet"
        errorElement.style.display = "flex"; // Visar elementet som normalt är dolt
        const closeBtnPopup = document.getElementById("close-pop-up-btn")
        if (closeBtnPopup) {
          closeBtnPopup.addEventListener("click", () => {
          errorElement.style.display = "none"; // släcker ner elementet
        });

        }
    }
}) //end of eventlistener

const closeBtn = document.getElementById("close-btn")
closeBtn.addEventListener("click", (event) => {closeModal("new-project-modal")})   
closeModal("new-project-modal")
console.log(closeBtn)


}   else {
    console.warn("No project form found")
}



const exportBtn = document.getElementById("export-btn")
if(exportBtn)  {
    exportBtn.addEventListener("click", () => {
        projectManager.exportJSON()
      })
}

const importBtn = document.getElementById("import-btn")
if(importBtn)  {
    importBtn.addEventListener("click", () => {
        projectManager.importJSON()
    })
}


const editbtn= document.getElementById("edit-button")
if (editbtn) {
    editbtn.addEventListener("click", () => {showModal("edit-project-modal")})
} else {
    console.warn("No new project button found")
}

//M2-Assignment Q#5
const editForm = document.getElementById("edit-project-form") as HTMLFormElement


if (editForm instanceof HTMLFormElement) {
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const projectID =  projectManager.id
        const projectToUpdate = projectManager.getProject(projectID)

        if(projectToUpdate) {
            projectToUpdate.description = formData.get("description") as string,
            projectToUpdate.name = formData.get("name") as string,  // hämtar värdet från inputfälten
            projectToUpdate.role = formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            projectToUpdate.status= formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            projectToUpdate.date = new Date (formData.get("date") as string) //
        }

        
        try {
            if (projectToUpdate) {
                projectManager.setDetailsPage(projectToUpdate, projectID); // Call the setDetailsPage method with the project and project.id
                projectToUpdate.setUI()
                editForm.reset(); // Reset the input fields
                toggleModal("edit-project-modal");
                console.warn(projectToUpdate);
                
            }
        } catch (error) {
            // Handle the error
        }
        const errorElement = document.getElementById("pop-up-modal") as HTMLElement
                errorElement.style.display = "flex"; // Visar elementet som normalt är dolt

                const closeBtnPopup = document.getElementById("close-pop-up-btn")
                if (closeBtnPopup) {
                  closeBtnPopup.addEventListener("click", () => {
                  errorElement.style.display = "none"; // släcker ner elementet
                });
                }

            }
    )
    };



//M2-Assigment-Q#6

const todDoForm = document.getElementById("T-Do-project-form") as HTMLFormElement

if(todDoForm instanceof HTMLFormElement) {
    todDoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(todDoForm);

        
        const todoData = {
            name: formData.get("name-todo") as string,
            description: formData.get("description-todo") as string,
            status: formData.get("status") as status,
            date : new Date(formData.get("date") as string).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
        })}
        
        // Select the div with class "To-dolist"
        const toDoListDiv = document.querySelector(".To-dolist");

        // Clone the div
        if (toDoListDiv) {
            const newDiv = toDoListDiv.cloneNode(true) as HTMLElement;
           
            newDiv.innerHTML = `
            <div class="To-dolist" style="display: flex;">
                <h4 name="name-todo" class="T-doHeader">${todoData.name}</h4>
                <p1 id="description-todo" name="description-todo"">${todoData.description}</p1>
                <p1 id="status-todo" name="status-todo">${todoData.status}</p1>
                <div id="date-todo">${todoData.date}</div>
                <i id="T-Symbol" class="material-icons">check</i>
             </div>
            `;
    
            newDiv.style.display = "flex"; 
            
            // Select the container within the .dashboard-card div to which you want to append the new div
            const container = document.querySelector(".dashboard-card-todo");
           

            // Append the new div to the container
            if (container) {
                container.appendChild(newDiv);
            }
        
        }

        // Toggle the modal
        toggleModal("T-Do-project-modal");
        todDoForm.reset()
        console.log()
    })
}



const edotTodo= document.getElementById("addTodo")
if (edotTodo) {
    edotTodo.addEventListener("click", () => {showModal("T-Do-project-modal")})
} else {
    console.warn("No new project button found")
}
const todoDiv = document.getElementById("To-dolist")  as HTMLDivElement 
todoDiv.style.display = "flex";