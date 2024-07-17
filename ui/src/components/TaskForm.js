import React, { useEffect, useState } from 'react';
import { taskGroups, taskPriorities } from './utils';

const TaskForm = ({ onSubmit, onCancel, initialValues }) => {
  const [formState, setFormState] = useState(initialValues);

  useEffect(() => {
    setFormState(initialValues);
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    if (!formState.id) {
      setFormState({ ...formState, description: '' });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <form
          onSubmit={handleSubmit}
          className="border rounded p-4 needs-validation"
          noValidate
        >
          <h4 className="mb-4">
            {formState.id
              ? 'Update Task ID: ' + formState.id
              : 'Create New Task'}
          </h4>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Text here ..."
              value={formState.description || ''}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              className="form-select"
              id="priority"
              value={formState.priority}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  priority: parseInt(e.target.value),
                })
              }
            >
              {Object.keys(taskPriorities).map((priority) => {
                return (
                  <option key={`priority-` + priority} value={priority}>
                    {taskPriorities[priority].text}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="group" className="form-label">
              Group
            </label>
            <select
              className="form-select"
              id="group"
              value={formState.group}
              onChange={(e) =>
                setFormState({ ...formState, group: e.target.value })
              }
            >
              {Object.keys(taskGroups).map((group) => {
                return (
                  <option
                    key={taskGroups[group].id}
                    value={taskGroups[group].id}
                  >
                    {taskGroups[group].emoji} {taskGroups[group].title}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="d-grid gap-2 d-flex justify-content-md-end">
            <div className="col-6 col-md-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary w-100"
              >
                Cancel
              </button>
            </div>
            <div className="col-6 col-md-auto">
              <button type="submit" className="btn btn-success w-100">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
