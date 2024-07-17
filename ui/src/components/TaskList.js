import React from 'react';
import { taskGroups } from './utils';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onComplete, onEdit, onDelete }) => {
  const filterTasksByGroup = (groupId) => {
    return (tasks || []).filter(
      (task) => !task.completed_at && task.group === groupId
    );
  };

  return (
    <div className="row">
      {Object.keys(taskGroups).map((group) => (
        <div key={taskGroups[group].id} className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h4>
                {taskGroups[group].emoji} {taskGroups[group].title} (
                {filterTasksByGroup(group).length})
              </h4>
              <ul className="list-group">
                {filterTasksByGroup(group)
                  .sort((a, b) => {
                    if (a.priority !== b.priority) {
                      return a.priority - b.priority;
                    } else {
                      return new Date(b.created_at) - new Date(a.created_at);
                    }
                  })
                  .map((task) => (
                    <li
                      key={task.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <TaskItem
                        task={task}
                        onComplete={onComplete}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// const TaskItem = ({ task, onComplete, onDelete, onEdit }) => {
//   return (
//     <>
//       <div>
//         <span className={'text-' + taskPriorities[task.priority].color}>
//           [{taskPriorities[task.priority].text}]
//         </span>{' '}
//         {task.description}
//       </div>
//       <div className="d-flex">
//         <button
//           className="btn btn-sm border mr-1"
//           onClick={() => onComplete(task.id)}
//         >
//           ✅
//         </button>
//         <button className="btn btn-sm border mx-1" onClick={() => onEdit(task)}>
//           ✏️
//         </button>
//         <button
//           className="btn btn-sm border ml-1"
//           onClick={() => onDelete(task.id)}
//         >
//           ❌
//         </button>
//       </div>
//     </>
//   );
// };

export default TaskList;
