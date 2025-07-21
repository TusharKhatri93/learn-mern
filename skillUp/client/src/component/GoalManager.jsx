import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function GoalManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading goals...</p>;

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl p-4 w-full">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={course.imageURL}
              alt={course.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-700 text-sm">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
