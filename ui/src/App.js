import React, { createContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeSwitcher from './components/ThemeSwitcher';
import { defaultValues } from './components/utils';
import TaskArchive from './components/TaskArchive';

export const ThemeContext = createContext(null);

const App = () => {
  const baseTitle = 'EisenMatrix';
  const title = process.env.REACT_APP_TITLE
    ? baseTitle + ' | ' + process.env.REACT_APP_TITLE
    : baseTitle;

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [theme, setTheme] = useState(getTheme());

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (formData) => {
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/tasks/${formData.id}` : '/api/tasks';
    await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    fetchTasks();
    if (formData.id) {
      setEditingTask(null);
    }
  };

  const handleComplete = async (id) => {
    await fetch(`/api/tasks/${id}/complete`, { method: 'PUT' });
    fetchTasks();
  };

  const handleReturn = async (id) => {
    await fetch(`/api/tasks/${id}/return`, { method: 'PUT' });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleNewTask = () => {
    setEditingTask(defaultValues);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  return (
    <div className="App">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ThemeContext.Provider value={theme}>
        <div className="contrainer px-4">
          <div className="d-flex justify-content-between align-items-center my-2">
            <h2>{baseTitle} 🎯</h2>
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
          </div>
          <div className="mb-4">
            {editingTask ? (
              <TaskForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialValues={editingTask}
              />
            ) : (
              <button onClick={handleNewTask} className="btn btn-success">
                New Task
              </button>
            )}
          </div>
          <TaskList
            tasks={tasks}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <TaskArchive
            tasks={tasks}
            onReturn={handleReturn}
            onDelete={handleDelete}
          />
        </div>
      </ThemeContext.Provider>
    </div>
  );
};

const getDefaultTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
};

const getTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme : getDefaultTheme();
};

export default App;
