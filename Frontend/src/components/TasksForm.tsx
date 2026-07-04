import { useRef } from "react";
import type { Task } from "../types/task";
import { postData } from "../utils/api";
import Button from "./Button";
import { theme } from "../constants/theme";

type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TasksForm = ({ tasks, setTasks }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = inputRef.current?.value?.trim();
    if (!value) return;

    const exists = tasks.some(
      (task) => task.title.toLowerCase() === value.toLowerCase()
    );
    
    if (exists) { 
      return;
    }
    
    const created = await postData<Task>("tasks", {
      title: value,
      completed: false, 
    }, "Task Item");

    setTasks((prev) => [...prev, created]);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form
      className={`w-full flex flex-row justify-between gap-8 p-2`}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Add a task"
        className={`
          w-full px-4 py-1
          bg-white 
          border-4 ${theme.outline.border} rounded-full
          `} 
        required
      />
      <Button 
      cn="text-white"
      value="Add" 
      type="submit" 
      />
    </form>
  );
};

export default TasksForm;