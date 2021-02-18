// Validation
type Validatable = {
  value: string | number
  require?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true
  if (validatableInput.require && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }

  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength
  }

  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.toString().trim.length <= validatableInput.maxLength
  }

  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }

  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }

  return isValid
}

// Auto Bind Decorator
function autoBind(_: any, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    },
  }
  return adjDescriptor
}

//Drag and Drop Interface
interface Draggable {
  dragStartHandler(event: DragEvent): void
  dragEndHandler(event: DragEvent): void
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void
  dropHandler(event: DragEvent): void
  dropLeaveHandler(event: DragEvent): void
}

//Project Type
enum ProjectStatus {
  Active,
  Finished,
}

type Listener<T> = (projects: T[]) => void
class Project {
  constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

// State Class
class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listener: Listener<T>) {
    this.listeners.push(listener)
  }
}

//ProjectState Class
class ProjectState extends State<Project> {
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
    const project = this.projects.find(({id}) =>  (id === prjId))
    if(project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    this.listeners.forEach((listenerFn) => listenerFn(this.projects.slice()))
  }
}

const prjState = ProjectState.getInstance()

//Component Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement
  hostEl: T
  el: U

  constructor(templateElId: string, hostElId: string, insertAtStart: boolean, newElId?: string) {
    this.templateEl = <HTMLTemplateElement>document.getElementById(templateElId)!
    this.hostEl = <T>document.getElementById(hostElId)!

    const importNode = document.importNode(this.templateEl.content, true)
    this.el = <U>importNode.firstElementChild
    newElId && (this.el.id = newElId)

    this.attach(insertAtStart)
  }

  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.el)
  }

  protected abstract configure(): void
  protected abstract renderContent(): void
}

//ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  get persons() {
    if (this.project.people === 1) return '1 person'
    else return `${this.project.people} persons`
  }

  constructor(hostId: string, private project: Project) {
    super('single-project', hostId, false, project.id)

    this.renderContent()
    this.configure()
  }

  @autoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id)
    event.dataTransfer!.effectAllowed = 'move'
  }

  @autoBind
  dragEndHandler(event: DragEvent) {
    console.log(event)
  }

  configure() {
    this.el.addEventListener('dragstart', this.dragStartHandler)
    this.el.addEventListener('dragend', this.dragEndHandler)
  }

  renderContent() {
    this.el.querySelector('h2')!.textContent = this.project.title
    this.el.querySelector('h3')!.textContent = this.persons + ' assigned'
    this.el.querySelector('p')!.textContent = this.project.description
  }
}
//ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[] = []

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)

    this.renderContent()
    this.configure()
  }

  @autoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault()
      const listEl = <HTMLElement>document.getElementById(`${this.type}-projects-list`)!
      listEl.classList.add('droppable')
    }
  }

  @autoBind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain')
    prjState.moveProject(prjId, this.type === 'active' ?  ProjectStatus.Active : ProjectStatus.Finished)
  }

  @autoBind
  dropLeaveHandler(event: DragEvent) {
    const listEl = <HTMLElement>document.getElementById(`${this.type}-projects-list`)!
    listEl.classList.remove('droppable')
  }

  configure() {
    prjState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === 'active') return prj.status === ProjectStatus.Active
        if (this.type === 'finished') return prj.status === ProjectStatus.Finished
      })

      this.assignedProjects = relevantProjects
      this.renderProjects()
    })

    this.el.addEventListener('dragover', this.dragOverHandler)
    this.el.addEventListener('drop', this.dropHandler)
    this.el.addEventListener('dragleave', this.dropLeaveHandler)
  }

  renderContent() {
    const listId = `${this.type}-projects-list`
    this.el.className = 'projects'
    this.el.querySelector('ul')!.id = listId
    this.el.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
  }

  private renderProjects() {
    const listEl = <HTMLElement>document.getElementById(`${this.type}-projects-list`)!
    listEl.innerHTML = ''
    this.assignedProjects.forEach((prj) => {
      new ProjectItem(listEl.id, prj)
    })
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement
  descriptionInputEl: HTMLInputElement
  peopleInputEl: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputEl = <HTMLInputElement>this.el.querySelector('#title')!
    this.descriptionInputEl = <HTMLInputElement>this.el.querySelector('#description')!
    this.peopleInputEl = <HTMLInputElement>this.el.querySelector('#people')!

    this.renderContent()
    this.configure()
  }

  @autoBind
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value
    const enteredDescription = this.descriptionInputEl.value
    const enteredPeople = this.peopleInputEl.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      require: true,
    }

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      require: true,
      minLength: 5,
    }

    const peopleValidatable: Validatable = {
      value: parseInt(enteredPeople),
      require: true,
      min: 1,
      max: 10,
    }

    if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
      alert('Invalid input')
      return
    } else return [enteredTitle, enteredDescription, parseInt(enteredPeople)]
  }

  @autoBind
  private clearInput() {
    this.titleInputEl.value = ''
    this.descriptionInputEl.value = ''
    this.peopleInputEl.value = ''
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      prjState.addProject(title, desc, people)
      this.clearInput()
    }
  }

  configure() {
    this.el.addEventListener('submit', this.submitHandler)
  }

  renderContent() {}
}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')
