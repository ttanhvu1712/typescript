import ProjectList from './components/ProjectList.js'
import ProjectInput from './components/ProjectInput.js'
namespace App {
  const prjInput = new ProjectInput()
  const activePrjList = new ProjectList('active')
  const finishedPrjList = new ProjectList('finished')
}
