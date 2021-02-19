import Project, { ProjectStatus } from '../models/Project'

type Listener<T> = (projects: T[]) => void

// State Class
class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listener: Listener<T>) {
    this.listeners.push(listener)
  }
}

//ProjectState Class
export default class ProjectState extends State<Project> {
  private projects: Project[] = []
  private static instance: ProjectState

  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) return this.instance
    this.instance = new ProjectState()
    return this.instance
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active)
    this.projects.push(newProject)
    this.updateListeners()
  }

  moveProject(prjId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(({ id }) => id === prjId)
    if (project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    this.listeners.forEach((listenerFn) => listenerFn(this.projects.slice()))
  }
}
