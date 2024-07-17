export const taskGroups = {
  'important-urgent': {
    id: 'important-urgent',
    title: 'Important and Urgent',
    emoji: '🚀',
  },
  'important-not-urgent': {
    id: 'important-not-urgent',
    title: 'Important but Not Urgent',
    emoji: '📅',
  },
  'not-important-urgent': {
    id: 'not-important-urgent',
    title: 'Not Important but Urgent',
    emoji: '🤝',
  },
  'not-important-not-urgent': {
    id: 'not-important-not-urgent',
    title: 'Not Important and Not Urgent',
    emoji: '🗑️',
  },
};

export const taskPriorities = {
  1: { text: 'high', color: 'danger' },
  2: { text: 'middle', color: 'warning' },
  3: { text: 'low', color: 'success' },
};

export const defaultValues = {
  group: taskGroups[Object.keys(taskGroups)[0]].id,
  priority: parseInt(Object.keys(taskPriorities)[1]),
};
