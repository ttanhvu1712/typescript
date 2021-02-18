// validation
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

// auto bind decorator
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

class ProjectList {
  templateEl: HTMLTemplateElement
  hostEl: HTMLDivElement
  el: HTMLElement

  constructor(private type: 'active' | 'finished' ) {
    this.templateEl = <HTMLTemplateElement>document.getElementById('project-list')!
    this.hostEl = <HTMLDivElement>document.getElementById('app')!

    const importNode = document.importNode(this.templateEl.content, true)
    this.el = <HTMLElement>importNode.firstElementChild
    this.el.id = `${this.type}-projects`

    this.attach()
    this.renderContent()
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`
    this.el.querySelector('ul')!.id = listId
    this.el.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
  }

  private attach() {
    this.hostEl.insertAdjacentElement('beforeend', this.el)
  }
}

// ProjectInput Class
class ProjectInput {
  templateEl: HTMLTemplateElement
  hostEl: HTMLDivElement
  el: HTMLFormElement
  titleInputEl: HTMLInputElement
  descriptionInputEl: HTMLInputElement
  peopleInputEl: HTMLInputElement

  constructor() {
    this.templateEl = <HTMLTemplateElement>document.getElementById('project-input')!
    this.hostEl = <HTMLDivElement>document.getElementById('app')!

    const importNode = document.importNode(this.templateEl.content, true)
    this.el = <HTMLFormElement>importNode.firstElementChild
    this.el.id = 'user-input'

    this.titleInputEl = <HTMLInputElement>this.el.querySelector('#title')!
    this.descriptionInputEl = <HTMLInputElement>this.el.querySelector('#description')!
    this.peopleInputEl = <HTMLInputElement>this.el.querySelector('#people')!

    this.configure()
    this.attach()
  }

  @autoBind
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value
    const enteredDescription = this.descriptionInputEl.value
    const enteredPeople = this.peopleInputEl.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      require: true
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
      console.log(this.gatherUserInput())
      this.clearInput()
    }
  }

  private configure() {
    this.el.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.el)
  }
}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')
