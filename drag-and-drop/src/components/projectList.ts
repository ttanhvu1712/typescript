/// <reference path="baseComponent.ts" />

namespace App {
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
      prjState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
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
}
