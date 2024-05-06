import { IProject, role, status } from "./classes/Project"
import { ProjectManager } from "./classes/ProjectManager"
import { closeModal, showModal, toggleModal, } from "./classes/Modal"
import { color, element } from "three/examples/jsm/nodes/Nodes.js"
import { Todo, ITodo } from "./classes/TodoClass"
import { v4 as uuidv4 } from 'uuid';
import { WebGLLights } from "three"

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
const projectPage = document.getElementById("project-page") as HTMLDivElement;
const homePageButton = document.getElementById("homebtn") as HTMLButtonElement;
const todoDiv = document.getElementById("To-dolist") as HTMLDivElement;

if (homePageButton) {
    homePageButton.addEventListener("click", () => {
        projectPage.style.display = "flex";
        todoDiv.style.display = "none";
    });
}



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
            date: new Date (formData.get("date") as string), //
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

const closeBtn = document.getElementById("close-btn") as HTMLButtonElement
closeBtn.addEventListener("click", (event) => {closeModal("new-project-modal")})   
closeModal("new-project-modal")
console.log(closeBtn)


}   else {
    console.warn("No project form found")
}

//M2-Assignment Q#7
const exportBtn = document.getElementById("export-btn")
if(exportBtn)  {
        exportBtn.addEventListener("click", () => {
            projectManager.exportToJSON();
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
        /* const projectID =  projectManager.id */
        const projectToUpdate = projectManager.getProject(projectManager.id)

        if(projectToUpdate) {
            projectToUpdate.description = formData.get("description") as string,
            projectToUpdate.name = formData.get("name") as string,  // hämtar värdet från inputfälten
            projectToUpdate.role = formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            projectToUpdate.status= formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            projectToUpdate.date = new Date (formData.get("date") as string) //
        }

        
        try {
            if (projectToUpdate) {
                projectManager.setDetailsPage(projectToUpdate, projectManager.id); // Call the setDetailsPage method with the project and project.id
                projectToUpdate.setUI()
                editForm.reset(); // Reset the input fields
                toggleModal("edit-project-modal");
                console.log(projectToUpdate);
                
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

    })
};

const closeBtn = document.getElementById("edit-close-btn") as HTMLButtonElement
closeBtn.addEventListener("click", (event) => {closeModal("edit-project-modal")})   
closeModal("edit-project-modal")
console.log(closeBtn)

const toDoListDivElement = document.getElementById("Todolist") as HTMLDivElement;
function colorChangeStatus (status:status, div:HTMLDivElement) {
    const statusColorMap = {
        pending: "red",
        closed: "green",
        archived: "red",
    };
    
    const color = statusColorMap[status] || "white";
    div.style.backgroundColor = color
}




//M2-Assigment-Q#6 ADD TODO
const addTodo= document.getElementById("addTodo") as HTMLButtonElement
if (addTodo) {
    addTodo.addEventListener("click", () => {showModal("T-Do-project-modal")})
} else {
    console.warn("No new project button found")
}
//M2-Assigment-Q#6
const todDoForm = document.getElementById("T-Do-project-form") as HTMLFormElement
    
    if(todDoForm instanceof HTMLFormElement ) {

        todDoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(todDoForm);
        
   /*      if (getTodo) {
            getTodo.description = formData.get("description-todo") as string;
            getTodo.name = formData.get("name-todo") as string;
            getTodo.status = formData.get("status") as status;
            getTodo.date = new Date(formData.get("date") as string);
            getTodo.id = uuidv4();
        }  */
        const todoData: ITodo = {
            id: uuidv4(),
            name: formData.get("name-todo") as string,
            description: formData.get("description-todo") as string,
            status: formData.get("status") as status,
            date : new Date(formData.get("date") as string).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                
                
            })
        } 
   
        
        // querySelect the div with class "To-dolist" 
        const toDoListDiv = document.querySelector(".Todolist");
        //Create new aa div Element
        if (toDoListDiv) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `
            <div class="Todolist" id="todo-list" style="display: flex";>
                <h4 name="name-todo" class="T-doHeader">${todoData.name}</h4>
                <p1 id="description-todo" name="description-todo">${todoData.description}</p1>
            <div id="date-todo">${todoData.date}</div>
                <div id="todostatus" name="todostatus">${todoData.status}</div>
            </div>
        ` ;
           newDiv.style.display = "flex"; 
           // colorChangeStatus(todoData.status as status, toDoListDivElement )
            // qeuerySelect the container within the .dashboard-card div to which you want to append the new div
           const container = document.querySelector(".dashboard-card-todo");
            // Append the new div to the container
            if (container) {
                container.appendChild(newDiv);
            } 
            
           //M2-Assigment-Q#9
            if (todoData.status === "Pending") {
                newDiv.style.backgroundColor = "yellow";
                newDiv.style.color = "black";
            } else if (todoData.status === "Closed") { 
                newDiv.style.backgroundColor = "red";
            } else {
                newDiv.style.color = "white";
            }
        }
        
        // Toggle the modal
        toggleModal("T-Do-project-modal");
        todDoForm.reset();

        //Using the addtodoproject to push it to an array property in Project Class
        const todo = todoData;
        const todoID = todoData.id ;
        const project = projectManager.id;
        const projectToUpdate = projectManager.getProject(project);
        if (projectToUpdate) {
            projectManager.addTodoToProject(todo, project);
            
        }
        
    }
    );

//Close todoform btn
const todocloseBtn = document.getElementById("todoclosebtn") as HTMLButtonElement;
todocloseBtn.addEventListener("click", () => {
    closeModal("T-Do-project-modal")
})


}