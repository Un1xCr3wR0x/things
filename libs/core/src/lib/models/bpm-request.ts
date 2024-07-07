import { TaskQuery, Limit, Join } from './bpm-tasks';
export class BPMRequest {
  join = new Join();
  limit = new Limit();
  taskQuery = new TaskQuery();
  constructor() {}
}
