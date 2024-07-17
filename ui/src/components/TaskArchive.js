import React, { useMemo } from 'react';
import TaskItem from './TaskItem';

const TaskArchive = ({ tasks, onReturn, onDelete }) => {
  const filteredTasks = useMemo(
    () =>
      (tasks || [])
        .filter((task) => !!task.completed_at)
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at)),
    [tasks]
  );

  if (filteredTasks.length === 0) {
    return <></>;
  }

  return (
    <div className="row mb-4">
      <div className="col-12">
        <h4>Archive ({filteredTasks.length})</h4>
        <ul className="list-group">
          {filteredTasks.map((task) => (
            <li
              key={'atask-' + task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <TaskItem
                task={task}
                showGroup={true}
                onReturn={onReturn}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskArchive;
