import { useState, useEffect } from "react";
import { MdEdit, MdCheck, MdClose, MdDelete } from "react-icons/md";

function TodoList() {
  const [tasks, setTasks] = useState(() => {
    // Ambil dari localStorage saat inisialisasi state
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error parsing tasks from localStorage", err);
      return [];
    }
  });
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Simpan tasks ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [
        ...prev,
        { text: newTask.trim(), completed: false, id: Date.now() },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim()) {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      );
      setTasks(updatedTasks);
    }
    setEditingTaskId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-white/80">Stay organized and productive</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/30 text-center">
            <div className="py-4 sm:py-0">
              <div className="text-2xl font-bold text-white">{totalTasks}</div>
              <div className="text-sm text-white/80">Total Tasks</div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="text-2xl font-bold text-white">
                {completedTasks}
              </div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="text-2xl font-bold text-white">
                {totalTasks - completedTasks}
              </div>
              <div className="text-sm text-white/80">Remaining</div>
            </div>
          </div>
          {totalTasks > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-white/80 mb-1">
                <span>Progress</span>
                <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Main Todo Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
          {/* Add Task Section */}
          <div className="relative mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-2xl border-0 outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-gray-800 placeholder-gray-500"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add new task..."
                />
              </div>
              <button
                onClick={addTask}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div
            className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-white/60 text-lg">No tasks yet</p>
                <p className="text-white/40 text-sm">
                  Add your first task to get started!
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                    task.completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Checkbox + Task */}
                    <div className="flex flex-1 items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`relative w-5 h-5 rounded-full border-2 transition-all duration-300 flex-shrink-0 mt-1 ${
                          task.completed
                            ? "bg-gradient-to-r from-green-400 to-blue-500 border-transparent"
                            : "border-white/50 hover:border-white"
                        }`}
                      >
                        {task.completed && (
                          <svg
                            className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Task Text or Edit Input */}
                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveEdit(task.id);
                            } else if (e.key === "Escape") {
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          className="flex-1 min-w-0 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        <span
                          className={`flex-1 text-white cursor-pointer transition-all duration-300 break-words ${
                            task.completed
                              ? "line-through opacity-60"
                              : "hover:text-white/80"
                          }`}
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          {task.text}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 sm:self-start self-end">
                      {editingTaskId === task.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(task.id)}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Save changes"
                          >
                            <MdCheck size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Cancel editing"
                          >
                            <MdClose size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(task.id, task.text)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit task"
                        >
                          <MdEdit size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Delete task"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {tasks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center text-white/60 text-sm">
                <span>{totalTasks - completedTasks} tasks remaining</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
