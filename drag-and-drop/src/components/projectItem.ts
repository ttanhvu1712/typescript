import Component from './BaseComponent.js'
import { Draggable } from '../models/DragDrop.js'
import Project from '../models/Project.js'
import autoBind from '../decorators/autoBind.js'
export default class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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
