import type { Task } from "../types/task";
import { deleteData, putData } from "../utils/api";
import Button from "../components/Button";
import { icons } from "../utils/imports";
import { theme } from "../constants/theme";

type Props = {
  cn?: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TaskItem = ({
  value,
  completed,
  onDelete,
  onComplete,
}: {
  value: string | undefined;
  completed: boolean;
  onDelete?: () => void;
  onComplete?: () => void;
}) => {

  return (
    <div
      className={`
        w-full
        flex flex-row justify-between items-center p-2 
        bg-white
        ${theme.outline.border} border-4 rounded-2xl
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
      `}

    >
      <div
      className={`
        w-[50%] flex-1
        flex flex-row justify-start items-center gap-2
        `}
      >
        <Button
        cn="w-fit"
        value={{
          name: "Complete",
          url: '',
          value: completed
        }}
        type='checkbox'
        onClick={onComplete}
        />
        <p 
        className={`
          ${completed ? "line-through" : ""} 
          max-w-[70%] 
          warp-break-all px-1 font-bold text-xl
          `}
        >
          {value}
        </p>
      </div>
      <Button
        value={{ name: "Delete", url: icons.trashCan }}
        type="button"
        onClick={onDelete}
      />
    </div>
  );
};

const TaskItemContainer = ({ cn, tasks = [], setTasks }: Props) => {

  const handleDelete = async (id: number) => {
    await deleteData("tasks", id, "Task Item");
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleComplete = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await putData("tasks", id, { completed: !task.completed }, "Task Item");
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div
      className={`max-h-120 flex flex-col flex-1 gap-1 px-4 overflow-x-hidden overflow-y-auto ${cn}`}
    >
      {tasks.length === 0 ? (
        <p className="m-auto text-3xl">No Tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            value={task.title}
            completed={task.completed}
            onDelete={() => handleDelete(task.id)}
            onComplete={() => handleComplete(task.id)}
          />
        ))
      )}
    </div>
  );
};

export default TaskItemContainer;