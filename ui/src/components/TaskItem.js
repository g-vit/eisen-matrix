import React from 'react';
import Linkify from 'linkify-react';
import { taskGroups, taskPriorities } from './utils';

const TaskItem = ({
  task,
  showGroup,
  onComplete,
  onReturn,
  onDelete,
  onEdit,
}) => {
  return (
    <>
      <div className='me-1'>
        {showGroup && taskGroups[task.group].emoji + ' '}
        <span className={'text-' + taskPriorities[task.priority].color}>
          [{taskPriorities[task.priority].text}]
        </span>{' '}
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
          <button
            className="btn btn-sm border"
            onClick={() => onEdit(task)}
          >
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

export default TaskItem;
