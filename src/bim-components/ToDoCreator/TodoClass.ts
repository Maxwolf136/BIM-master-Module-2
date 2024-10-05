import { v4 as uuidv4 } from 'uuid';
import * as OBC from "openbim-components"
import { TodoCreator } from '.';
import * as THREE from "three"

import { TodoCard } from '../src/TodoCard';

type ToDoPriority = "Low" | "Medium" | "High"

interface IToDo  {
  description: string
  date: Date
  fragmentMap: OBC.FragmentIdMap
  camera: {position: THREE.Vector3, target: THREE.Vector3}
  priority: ToDoPriority
}


export class Todo extends OBC.Component<Todo[]> implements IToDo {
  enabled: true;
  description: string
  date: Date
  fragmentMap: OBC.FragmentIdMap
  camera: {position: THREE.Vector3, target: THREE.Vector3}
  priority: ToDoPriority


  private _components: OBC.Components 
  private _list: Todo [] = []

  constructor(components: OBC.Components) {
    super(components)
    for (const key in components) {
      this[key] = components[key]
    }
    
  }

  async todoCamera(description: string, priority: ToDoPriority) {
    if(!this.enabled) {return}
    const camera = this.camera
    if(!(camera instanceof OBC.OrthoPerspectiveCamera)) {
      throw new Error ("todoCreator need to the orotoprospective camerea in order to work")
    }
    const position = new THREE.Vector3()
    camera.controls.getPosition(position)
    const target = new THREE.Vector3()
    camera.controls.getTarget(target)
    const todoCamera = {position, target}

    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    const todo: IToDo = {
      camera: todoCamera,
      description,
      date: new Date(),
      fragmentMap: highlighter.selection.select,
      priority
    }
    this._list.push(todo)
  }

  get(): Todo [] {
    throw new Error('Method not implemented.');
  }
}