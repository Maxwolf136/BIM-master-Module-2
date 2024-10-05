import * as React from "react";
import { Project } from "../classes/Project";
import {Todo, ITodo, } from "../classes/TodoClass"
import { v4 as uuidv4 } from 'uuid';

interface Props {
    Todo: Project
}

export function TodoCard() {
    const [todo, setTodo] = React.useState()



    const onClickAddTodo = () => {
      const modal = document.getElementById("todo-project-modal");
      if (!(modal instanceof HTMLDialogElement)) {return;}
      modal.showModal();
  
    }

    const onTodoCreate = () =>{
      
      const todoForm =  document.getElementById("todo-project-form") as HTMLFormElement

      const formData = new FormData(todoForm)
      if(todoForm instanceof HTMLFormElement) {
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

        const todoDiv = document.querySelector(".toDoList")
        if(todoDiv) {
          const newDiv = document.createElement("div");
          newDiv.innerHTML = `
          <div class="todo-item" id="toDoList" style="display: flex";>
              <h4 name="name-todo" class="T-doHeader">${todoData.name}</h4>
              <p1 id="description-todo" name="description-todo">${todoData.description}</p1>
          <div id="date-todo">${todoData.date}</div>
              <div id="todostatus" name="todostatus">${todoData.status}</div>
          </div>
          ` ;
          newDiv.style.display = "flex"; 
          const container = document.querySelector(".dashboard-card");
            // Append the new div to the container
            if (container) {
                container.appendChild(newDiv);
            } 
        }
        
      }
  }
    
return(
        <div className="dashboard-card" style={{ flexGrow: 1 }}>
        <dialog id="todo-project-modal">
    <form id="todo-project-form">
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
          <button id="close-btn" type="button"> Cancel</button>
          <button onClick= {onTodoCreate} id="create-btn" type="submit">Update</button>
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
        <div
          style={{
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <h4>To-Do</h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              columnGap: 20
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", columnGap: 10 }}
            >
              <span className="material-icons-round">search</span>
              <input
                type="text"
                placeholder="Search To-Do's by name"
                style={{ width: "100%" }}
              />
            </div>
            <button onClick={onClickAddTodo} id="addTodobtn" className="material-icons-round">add</button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px 30px",
            rowGap: 20
          }}
        >
          <div id="toDoList" className="todo-item">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div
                style={{ display: "flex", columnGap: 15, alignItems: "center" }}
              >
                <span
                  className="material-icons-round"
                  style={{
                    padding: 10,
                    backgroundColor: "#686868",
                    borderRadius: 10
                  }}
                >
                  construction
                </span>
                <p>Make anything here as you want, even something longer.</p>
              </div>
              <p style={{ textWrap: "nowrap", marginLeft: 10 }}>Fri, 20 sep</p>
            </div>
          </div>
        </div>
      </div>
    )
}