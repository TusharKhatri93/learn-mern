import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TaskManager from "./TaskManager";
import toast from "react-hot-toast";
import axios from "../utils/axios";

export default function GoalManager() {
  const [title, setTitle] = useState("");
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAddGoal = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title can not be empty");

    setLoading(true);
    try {
      const token = await user.getIdToken();
      await axios.post(
        "/goals",
        { title: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Goal added successfully");
      fetchGoals();
      setTitle("");

    } catch (err) {
      toast.error("Error adding Goal");
    }
    setLoading(false);
  }

  const handleDeleteGoal = async (goalId) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Goal deleted successfully");
      fetchGoals();
    } catch (err) {
      toast.error("Error deleting goal");
    }
  };


  const fetchGoals = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`/goals/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(res.data);
    } catch (err) {
      toast.error("Error fetching goals");
    }
  };

  useEffect(() => {
    if (user) fetchGoals();
  }, [user]);

  if (loading) return <p className="text-center text-lg">Loading goals...</p>;

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Your learning goals</h2>
      <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="eg. React native"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700"
        >{loading ? "Adding.." : "Add Goal"}</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div key={goal._id} className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold mb-2">{goal.title}</h3>
            <TaskManager goalId={goal._id} />
            <button
              onClick={() => handleDeleteGoal(goal._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>

  );
}
