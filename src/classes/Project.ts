import { v4 as uuidv4 } from 'uuid';
import { ProjectManager } from './ProjectManager';

 //M2-Assignment Q#2
const colorArray = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'grey'];

function changeColorIcon() {
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    return color;   
}

const projectToUpdate =[]


// För att det är valbara alternativ
export type role = "Admin" | "Manager" | "Developer" | "Designer"
export type status = "pending" | "closed " | "archived"


export interface IProject {
    name: string
    description: string
    role: role // role: role
    status: status // status: status
    date: Date

}

//M2-Assigment-#6
export interface ITodo {
    name: string;
    description: string;
    role: role; // assuming 'role' is a type you've defined
    status: status; // assuming 'status' is a type you've defined
    date: Date;
}


export class Project implements IProject{
    name: string
    description: string
    role: role
    status: status
    date: Date

// Variabler Property
ui: HTMLDivElement // skapar en ny variabel som är av typen HTMLDivElement
cost: number = 2
progess: number = 0
id: string
//M2-Assigment-#6
todos: ITodo[];

 constructor(data: IProject, todos: ITodo[] = []) {
//M2-Assigment-#6
        this.todos = todos

        //project card Property defintion
      
        for (const key in data) {
            this[key] = data[key]
            console.log(key, data[key])
        }
        const key = this.id;
        if (this[key] === data[key]) {
            console.log("successful");
        }
        if (this[key] !== data[key]) {
            console.log("not successful");
        }
        //M2-Assigment Q#4
        if (this.date !== undefined) {
            console.warn("ingen dataum satt")
            this.date = new Date('1994-03-14')    
        }
       
        //UNIK ID per Projekt
        this.id = uuidv4();
        this.setUI();
    
        console.log(todos)
    }
    

    setUI() { 
        if (this.ui){return}
        this.ui = document.createElement("div") // skapar en ny div
        this.ui.className = "project-card" // ger ui div:en klassen "project-card" och ger CSS-style enligt classen
        //M2-Assignment Q#2
        const randomColor = changeColorIcon()
        
        //M2-Assignment Q#1
        this.ui.innerHTML = ` 
    <div class="card-header">            
    <p style="background-color: ${randomColor}; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${this.name.slice(0,2)}</p>
                <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
                </div>
                <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.role}</p>
                </div>
                <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
                </div>
                <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progess*100} %</p>
                </div>
            </div>
    `}
}

