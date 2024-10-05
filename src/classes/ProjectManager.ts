import { Input } from 'postcss';
import { Project, IProject } from './Project';
import { showModal, toggleModal,  } from './Modal';

export class ProjectManager {
    list: Project[] = [] // skapar en ny array med typen Project
    onProjectCreated = (project: Project) =>  {}
    onProjectDeleted = (project: Project) =>  {}
    onProjectUpdated = (project: Project) =>  {}



    
    filterProjects (value:string) {
        const filterProjects = this.list.filter((project) => {
            return project.name.includes(value)
          })
          return filterProjects
    }

    newProject(data: IProject, id?: string) { // skapar en ny metod som tar in data av typen IProject
        const projectNames = this.list.map((project) =>  {
            return project.name
        })

        
        const nameToLong = data.name.length > 5
        if (nameToLong){
            console.warn("för långt namn")
            return false 
        } 

        const project = new Project(data, id); 
        const projectExcist = this.doesProjectExcist(project)

        if(projectExcist) {
            this.updateProject(project)
        }
        else {
            const nameInUse = projectNames.includes(data.name)
            if (nameInUse) {
                throw new Error(data.name + "finns redan") // skapar en ny error som skickar ut ett meddelande om att namnet redan finns
                
            }
            this.list.push(project);
            this.onProjectCreated(project)
        }
        return project
    }
    

//M2-Assignment Q#5
        getProject(id:string) {
            console.log(`Searching for project with id: ${id}`);
            const project = this.list.find((project) => {
                console.log(`Checking project with id: ${project.id}`);
                return project.id === id;
            })
            if (project) {
                console.log(`Found project with id: ${project.id}`);
            } else {
                console.log(`No project found with id: ${id}`);
            }
            return project;
        }

        deleteProject(id: string) {
            const project = this.getProject(id)
            if (!project) {return}
          

            const remaining = this.list.filter((project) => {
                return project.id !== id
            })
            this.list = remaining
            this.onProjectDeleted(project)
        }

        getTotalCost() {
            const totalCost = this.list.reduce((accumulator, project) => accumulator + project.cost, 0);
            return totalCost;
        }

        
        getProjectbyName(id: string) {
            const projectname = this.list.find((project) => {project.name
                return projectname.name === id
            })
            
            
        }
        
        doesProjectExcist(updatedProject: Project) {
            const project = this.list.find(project => project.id === updatedProject.id);
            if (!project) {
               return false
            }
            else {
                return true
            }
            
        }

        updateProject(updatedProject: Project) {
            const project = this.list.find(project => project.id === updatedProject.id);
            if (!project) {
                throw new Error('Project not found');
            }
            this.list = this.list.map(project => project.id === updatedProject.id ? updatedProject : project)
            this.onProjectUpdated(updatedProject)
        }

        addProject(project: Project) {
            this.list.push(project);
        }

        exportJSON(filename: string = "projects.json") {
            const json = JSON.stringify(this.list, null, 2)
            const blob = new Blob([json], {type: "application/json"}) // skapar en ny blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "projects.json"
            a.click()
            URL.revokeObjectURL(url)
        }


        importJSON(){
            const input = document.createElement(`input`)
            input.type = `file`
            input.accept = `application/json`
            const reader = new FileReader()
            reader.addEventListener( "load", () => {
                const json = reader.result
                if (!json) {return}
                const projects: IProject[] = JSON.parse(json as string)
                for (const project of projects) {
                    try {
                        this.newProject(project)
                    } catch (error) {
                        console.warn(error)
                    }
                } 
            })


            input.addEventListener(`change`, () => {
                const filelist = input.files
                if (!filelist) {return}
                reader.readAsText(filelist[0])
            })
            input.click()
        }
        
    }
