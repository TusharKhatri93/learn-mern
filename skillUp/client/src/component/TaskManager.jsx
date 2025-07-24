import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ProgressChart from "./ProgressChart";
import axios from "../utils/axios";

export default function TaskManager({ goalId }) {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [reminderAt, setReminderAt] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!task.trim()) return toast.error("Task can not be empty");

        setLoading(true);
        try {
            const token = await user.getIdToken();
            await axios.post("/tasks", {
                title: task,
                reminderAt: reminderAt || null,
                goalId,
                uid: user.uid,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            toast.success("Task added successfully");
            setTask("");
            setReminderAt("");
            fetchTasks();
        }
        catch (err) {
            toast.error("Error adding task" || err.message);
        }
        setLoading(false);
    };

    const fetchTasks = async () => {
        if (!user || !goalId) return;
        try {
            const token = await user.getIdToken();
            const res = await axios.get(`/tasks/${goalId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(res.data);
        } catch (err) {
            toast.error("Error fetching tasks");
        }
    };

    const toggleCompletion = async (taskId, currentStatus) => {
        try {
            const token = await user.getIdToken();
            await axios.patch(`/tasks/toggle/${taskId}`, {
                completed: !currentStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            fetchTasks();
        } catch (err) {
            toast.error("Error updating task");
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const token = await user.getIdToken();
            await axios.patch(`/tasks/${taskId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            toast.success("Task deleted successfully");
            fetchTasks();
        } catch (err) {
            toast.error("Error deleting task");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user, goalId]);

    return (
        <>
            <ProgressChart tasks={tasks} />
            <div className="bg-gray-100 p-4 rounded mt-4 w-full max-w-2xl mx-auto">
                <form onSubmit={handleAddTask} className="flex flex-col gap-2 mb-4">
                    <input
                        type="text"
                        value={task}
                        placeholder="Enter a task"
                        onChange={(e) => setTask(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />

                    <div className="flex gap-2 items-center justify-center">
                        <input
                            type="datetime-local"
                            value={reminderAt}
                            onChange={(e) => setReminderAt(e.target.value)}
                            className="w-40 h-8 border px-3 py-2 rounded"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            {loading ? "Adding..." : "Add Task"}
                        </button>
                    </div>
                </form>

                <ul className="space-y-2 bg-gray-200 rounded p-3">
                    {tasks.map((task) => (
                        <li
                            key={task._id}
                            className="bg-white p-3 rounded shadow"
                        >
                            {/* First row: Task and delete */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleCompletion(task._id, task.completed)}
                                    />
                                    <span className={task.completed ? "line-through text-gray-500" : ""}>
                                        {task.title}
                                    </span>
                                </label>
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Second row: Reminder */}
                            {task.reminderAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Reminder: {new Date(task.reminderAt.seconds * 1000).toLocaleString()}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>

            </div>
        </>
    );
}