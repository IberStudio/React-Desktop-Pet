import { useState, useEffect } from "react";
import TasksForm from "../components/TasksForm";
import TaskItemContainer from "../components/TasksItem";
import { getData } from "../utils/api";
import type { Task } from "../types/task";
import { theme } from "../constants/theme";
import { LoadingProvider } from "../context/LoadingContext";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      let data
      try {
        data = await getData<Task[]>("tasks", "Task Items");
      }
      finally {
      }
      setTasks(data ?? []);
    };
    loadTasks();
  }, []);

  return (
    <div
    className={`w-full h-full flex flex-row`}
    >
      <LoadingProvider loadingKey='Task Items'/>
      <div
      className={`
        relative
        w-1/3
        flex-1 flex flex-col p-2 
        ${theme.secondary.bg}
        border-r-4 ${theme.outline.border}
        `}
      >
        <div className="flex flex-col gap-4 py-6">
          <h2
          className="text-3xl text-center font-bold"
          >
            Tasks
          </h2>
          <TasksForm tasks={tasks} setTasks={setTasks} />
        </div>
        <TaskItemContainer tasks={tasks} setTasks={setTasks} />
      </div>
    </div>
  );
};

export default Tasks;