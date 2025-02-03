import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import Confetti from "react-confetti";
// import { jsPDF } from "jspdf";
import "jspdf-autotable";
import './weeklytasks.css';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID for unique task IDs

const WeeklyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [celebration, setCelebration] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [dates, setDates] = useState({});
  const [showFullTitlePopup, setShowFullTitlePopup] = useState(false);
  const [fullTitle, setFullTitle] = useState("");
  let weekDates = {};

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Function to format date as dd/mm/yyyy
  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  
  // Function to calculate the week dates (previous for past days, upcoming for future)
  const calculateUpcomingWeekDates = () => {
    let today = new Date();
    let dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
    let weekDates = {};
  
    // Find the Monday of the current week
    let mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
    for (let i = 0; i < 7; i++) {
      let date = new Date(mondayOfThisWeek);
      date.setDate(mondayOfThisWeek.getDate() + i); // Calculate each day's date
  
      // If the date is in the past (before today), get last week's equivalent
      if (date < today) {
        date.setDate(date.getDate() - 7);
      }
  
      weekDates[days[i]] = formatDate(date);
    }
  
    console.log(weekDates);
    setDates(weekDates);
  };

  useEffect(() => {
    calculateUpcomingWeekDates();  // Calculate the upcoming week's dates when the component mounts
  }, []);

  const addTask = () => {
    if (isLocked || taskInput.trim() === "") return;
    const newTask = {
      id: uuidv4(),  // Unique ID for each task
      title: taskInput,
      day: selectedDay,
      status: "Yet to Start"
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    saveToBrowser();
    
  };

  const updateTaskStatus = (taskId, status) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.removeItem('tasks', JSON.stringify(tasks));
  };

  // const saveProgress = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text(`Weekly Tasks Progress ${new Date()}`, 10, 10);

  //   const headers = [["Day", "Task", "Status"]];
  //   const data = tasks.map((task) => [task.day, task.title, task.status]);

  //   doc.autoTable({
  //     head: headers,
  //     body: data,
  //     startY: 20,
  //     theme: "grid",
  //     headStyles: { fillColor: [60, 179, 113] },
  //     styles: { halign: "center" },
  //   });

  //   doc.save(`Weekly_Tasks_Progress_${new Date()}.pdf`);
  //   setIsLocked(false);
  //   setIsSaveVisible(false);
  // };

  const toggleLock = () => {
    if (isLocked) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      setIsSaveVisible(true);
    } else {
      setIsLocked(true);
    }
  };
  const truncateTitle = (title) => {
    if (title.length > 12) {
      return `${title.slice(0, 12)}...`;
    }
    return title;
  };

  const handleTitleClick = (title) => {
    setFullTitle(title);
    setShowFullTitlePopup(true);
  };

  const isDayCompleted = (day) => {
    const dayTasks = tasks.filter((task) => task.day === day);
    return dayTasks.length > 0 && dayTasks.every((task) => task.status === "Completed");
  };

  const saveToFile = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `tasks_${new Date()}.json`,
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(tasks, null, 2));
      await writable.close();
      localStorage.removeItem('tasks');
      alert("Tasks saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const loadFromFile = async () => {
    try {
    
      if(localStorage.getItem('tasks') !== null)
        {
          const storedTasks = JSON.parse(localStorage.getItem('tasks'));
          console.log(storedTasks)
          setTasks(storedTasks);
          alert("Tasks loaded successfully!");

        }
        else{
            const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
    });

      const file = await handle.getFile();
      const content = await file.text();
      const loadedTasks = JSON.parse(content);
      setTasks(loadedTasks);

        }
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };
  const saveToBrowser = async () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  return (
    <div className="center-card">
      <div className="card-container">
        {celebration && <Confetti recycle={false} numberOfPieces={200} />}
        <h1 className="text-2xl font-bold mb-4">Weekly Tasks Tracker</h1>

        <div>
          <input
            type="text"
            placeholder="Enter your task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            disabled={isLocked}
            className="input-field"
            style={{ width: '86%' }}
          />
          <div className="dropdown">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              disabled={isLocked}
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day} ({dates[day] || 'Loading...'})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-container">
            <Button
              onClick={addTask}
              className={`flex-item rounded-md text-white ${isLocked ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
              // disabled={isLocked}
            >
              Add Task
            </Button>

            {/* <Button onClick={saveToBrowser} className="flex-item rounded-md bg-green-500 text-white hover:bg-green-600">
              Save
            </Button> */}
            
            <Button
              onClick={loadFromFile}
              className="flex-item rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Load Tasks
            </Button>
            <Button
              onClick={toggleLock}
              className="flex-item rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
            >
              {isLocked ? "Save Progress To File" : "Save"}
            </Button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Day</th>
                  <th className="border border-gray-300 px-4 py-2">Task</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const dayTasks = tasks.filter((task) => task.day === day);
                  if (dayTasks.length === 0) return null;

                  return dayTasks.map((task, index) => (
                    <tr
                      key={task.id} // Using task.id as the unique key
                      className={isDayCompleted(day) ? "bg-green-100" : ""}
                    >
                      {index === 0 && (
                        <td
                          className={`border border-gray-300 px-4 py-2 font-bold ${isDayCompleted(day) ? "bg-green-500 text-white" : ""}`}
                          rowSpan={dayTasks.length}
                        >
                          {day} ({dates[day]})
                        </td>
                      )}
                      <td
                        className="border border-gray-300 px-4 py-2"
                        onClick={() => handleTitleClick(task.title)}
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        {truncateTitle(task.title)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{task.status}</td>
                      <td className="border border-gray-300 px-4 py-2 ">
                        <Button
                          onClick={() => updateTaskStatus(task.id, "Yet to Start")}
                          className={`px-2 py-1 ${task.status === "Yet to Start" ? "bg-green-500" : "bg-gray-200"} text-black `}
                        >
                          Yet to Start
                        </Button>
                        <Button
                          onClick={() => updateTaskStatus(task.id, "In Progress")}
                          className={`px-2 py-1 ${task.status === "In Progress" ? "bg-green-500" : "bg-gray-200"} text-black mr-2`}
                        >
                          In Progress
                        </Button>
                        <Button
                          onClick={() => updateTaskStatus(task.id, "Completed") && setCelebration(true)}
                          className={`px-2 py-1 ${task.status === "Completed" ? "bg-green-500" : "bg-gray-200"} text-black mr-2`}
                        >
                          Done
                        </Button>
                        <Button
                          onClick={() => deleteTask(task.id)}
                          className="px-2 py-1 bg-red-500 text-black"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}

        {isSaveVisible && (
          <div className="mt-4">
            <Button
              onClick={saveToFile}
              className="w-full px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Save Progress and Download
            </Button>
          </div>
        )}
      </div>
      {showFullTitlePopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* <h2>Full Task Title</h2> */}
            <h2>{fullTitle}</h2>
            <Button onClick={() => setShowFullTitlePopup(false)} className="bg-red-500 text-white">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTasks;
