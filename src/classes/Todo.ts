import { v4 as uuidv4 } from 'uuid';
import { IProject, Project } from './Project';

//M2-Assigment-#6

export interface ITodo {
    name: string;
    description: string;
    status: string;
    date: Date;
    color: string
    id: string
}

export class Todo implements ITodo {
    name: string;
    description: string;
    status: string;
    date: Date;
    color: string
    id: string

    constructor(data: IProject, Date) {
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.date = new Date;
        this.id = uuidv4()
        
    }

}