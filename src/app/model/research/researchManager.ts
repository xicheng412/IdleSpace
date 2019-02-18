import { Research } from "./research";
import { ResourceManager } from "../resource/resourceManager";

export class ResearchManager {
  researches = new Array<Research>();
  toDo = new Array<Research>();
  completed = new Array<Research>();

  //#region Researches
  alloy: Research;
  betterResearch: Research;
  //#endregion

  constructor() {
    const resManager = ResourceManager.getInstance();
    this.betterResearch = new Research("r", 50);
    this.betterResearch.limit = new Decimal(Number.POSITIVE_INFINITY);

    this.alloy = new Research("a", 100);
    this.alloy.toUnlock = [
      resManager.alloy,
      resManager.alloyFoundry,
      resManager.alloyX1
    ];

    this.toDo = [this.alloy, this.betterResearch];
    this.researches = [this.alloy, this.betterResearch];
  }

  update(progress: Decimal) {
    while (progress.gt(0) && this.toDo.length > 0) {
      const res = this.toDo[0];
      progress = res.addProgress(progress);
      if (res.completed) {
        this.toDo.shift();
        this.completed.push(res);
      } else if (progress.gt(0)) {
        this.toDo.shift();
        this.toDo.push(res);
      }
    }
  }
  addAvailable(res: Research) {
    if (!res.completed && !this.toDo.includes(res)) this.toDo.push(res);
  }

  getSave(): any {
    const save: any = {};
    save.t = this.toDo.map(r => r.getSave());
    save.c = this.completed.map(r => r.getSave());
    return save;
  }
  load(data: any): boolean {
    this.toDo = [];
    this.completed = [];

    if ("t" in data) {
      for (const res of data.t) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          this.toDo.push(research);
        }
      }
    }

    if ("c" in data) {
      for (const res of data.t) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          this.completed.push(research);
        }
      }
    }

    return true;
  }
}
