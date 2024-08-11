import React, { useContext } from 'react';
import Linkify from 'linkify-react';
import { taskGroups, taskPriorities } from './utils';
import { ThemeContext } from '../App';

const TaskItem = ({
  task,
  showGroup,
  onComplete,
  onReturn,
  onDelete,
  onEdit,
}) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <div className="me-1">
        {showGroup && taskGroups[task.group].emoji + ' '}
        <PriorityItem priority={task.priority} theme={theme} />
        <Linkify>{task.description}</Linkify>
      </div>
      <div className="d-grid gap-1 d-flex justify-content-md-end">
        {onComplete && (
          <button
            className="btn btn-sm border"
            onClick={() => onComplete(task.id)}
          >
            ✅
          </button>
        )}
        {onReturn && (
          <button
            className="btn btn-sm border"
            onClick={() => onReturn(task.id)}
          >
            ↩️
          </button>
        )}
        {onEdit && (
          <button className="btn btn-sm border" onClick={() => onEdit(task)}>
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn-sm border"
            onClick={() => onDelete(task.id)}
          >
            ❌
          </button>
        )}
      </div>
    </>
  );
};

const PriorityItem = ({ priority, theme }) => {
  return (
    <span
      className={`me-1 badge rounded-pill border ${
        theme === 'light' ? ' text-dark' : ''
      }`}
    >
      {taskPriorities[priority].icon} {taskPriorities[priority].text}
    </span>
  );
};

export default TaskItem;
