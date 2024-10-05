import { Container } from "postcss";
import { Project } from "./Project";
import { v4 as uuidv4 } from 'uuid';

const colorArray = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'grey'];



function changeColorIcon() {
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    return color;   
}

//M2-Assigment-#6
export interface ITodo {
    name: string;
    description: string;
    status: string;
    date: Date;
    color: string
    id: string
    ui: HTMLDivElement
}

export class Todo implements ITodo {
    list: Todo [] = []
    name: string;
    description: string;
    status: string;
    date: Date;
    color: string
    id: string
    ui: HTMLDivElement

  
    constructor(data: ITodo, Date ) {
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.date = new Date;
        this.id = uuidv4()
    }

    setUI() { 
        if (this.ui){return}
        this.ui = document.createElement('div') // skapar en ny div
        this.ui.className = "Todolist" // ger ui div:en klassen "
        
        //M2-Assignment Q#1
        this.ui.innerHTML = `
        <div class="Todolist" id="todo-list" style="display: flex";>
            <h4 name="name-todo" class="T-doHeader">${this.name}</h4>
            <p1 id="description-todo" name="description-todo">${this.description}</p1>
            <div id="date-todo">${this.date}</div>
            <p id="editTod" name="editTodo">${this.status}</p>
        </div>
        `;
        const container = document.querySelector(".dashboard-card-todo") as HTMLDivElement
        container.appendChild(this.ui);
    }
    }

