class Department {

  constructor(private id:string, public name: string) {}

  describe() {
    console.log(`Describe ${this.id}: ${this.name}`)
  }
}

const accounting = new Department('d1', 'sss')
accounting.describe()
