export interface Task{
    id:number;
    title: string;
    items: TaskItem[];
    done: boolean; // Add a 'done' state for the whole category
}

export interface TaskItem {
  text: string;
  done: boolean;
}
