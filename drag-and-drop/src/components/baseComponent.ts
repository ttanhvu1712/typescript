namespace App {
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}
