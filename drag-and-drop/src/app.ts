class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  el: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLAreaElement;
  peopleInputEl: HTMLInputElement;


  constructor() {
    this.templateEl = <HTMLTemplateElement>document.getElementById('project-input')!;
    this.hostEl = <HTMLDivElement>document.getElementById('app')!;

    const importNode = document.importNode(this.templateEl.content, true)
    this.el = <HTMLFormElement>importNode.firstElementChild;
    this.el.id = "user-input";

    this.titleInputEl =  <HTMLInputElement>this.el.querySelector("#title")!
    this.descriptionInputEl =  <HTMLAreaElement>this.el.querySelector("#description")!
    this.peopleInputEl =  <HTMLInputElement>this.el.querySelector("#people")!

    this.configure()
    this.attach()
  }

  private submitHandler(event: Event) {
    event.preventDefault()
    console.log(this.titleInputEl.value)
  }

  private configure() {
    this.el.addEventListener("submit", this.submitHandler.bind(this))
  }

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.el)
  }
}

const prjInput = new ProjectInput()