/// <reference path="models/dragDrop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/projectState.ts" />
/// <reference path="utils/validation.ts" />
/// <reference path="decorators/autoBind.ts" />
/// <reference path="components/projectItem.ts" />
/// <reference path="components/projectList.ts" />
/// <reference path="components/projectInput.ts" />

namespace App {
  const prjInput = new ProjectInput()
  const activePrjList = new ProjectList('active')
  const finishedPrjList = new ProjectList('finished')
}
