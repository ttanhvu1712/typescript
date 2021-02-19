import Component from './BaseComponent.js'
import validate, { Validatable } from '../utils/validation.js'
import ProjectState from '../state/ProjectState.js'
import autoBind from '../decorators/autoBind.js'

const prjState = ProjectState.getInstance()
export default class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
