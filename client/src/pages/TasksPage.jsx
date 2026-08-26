import { useEffect, useState } from 'react';
import { createTask, getTasks } from '../services/taskService';
import { getSubjects } from '../services/subjectService';
import StudyPlanGenerator from '../components/StudyPlanGenerator';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending',
  subjectId: '',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadPageData() {
      setIsLoading(true);
      setError('');
      try {
        const [loadedTasks, loadedSubjects] = await Promise.all([getTasks(), getSubjects()]);
        if (isCurrent) {
          setTasks(loadedTasks);
          setSubjects(loadedSubjects);
          setForm((currentForm) => ({
            ...currentForm,
            subjectId: currentForm.subjectId || String(loadedSubjects[0]?.id || ''),
          }));
        }
      } catch (requestError) {
        if (isCurrent) setError(requestError.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadPageData();
    return () => {
      isCurrent = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await createTask({
        subject_id: Number(form.subjectId),
        title: form.title,
        description: form.description,
        due_date: form.dueDate || null,
        status: form.status,
      });
      setTasks(await getTasks());
      setForm((currentForm) => ({ ...initialForm, subjectId: currentForm.subjectId }));
      setSuccessMessage('Task created successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="dashboard">
      <section className="page-heading">
        <p className="eyebrow">Study plan</p>
        <h1>Tasks</h1>
        <p>Keep the next useful step visible and manageable.</p>
      </section>

      <section className="task-layout">
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>Add a task</h2>
          <label>
            Subject
            <select name="subjectId" value={form.subjectId} onChange={handleChange} required>
              <option value="">Choose a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required maxLength="200" />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" maxLength="2000" />
          </label>
          <div className="form-row">
            <label>
              Due date
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" disabled={isSubmitting || !subjects.length}>
            {isSubmitting ? 'Saving...' : 'Add task'}
          </button>
        </form>

        <section className="task-list" aria-labelledby="task-list-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your queue</p>
              <h2 id="task-list-heading">Upcoming tasks</h2>
            </div>
            <span className="task-count">{tasks.length}</span>
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {isLoading && <p className="state-message">Loading tasks...</p>}
          {!isLoading && error && <p className="state-message error-message">{error}</p>}
          {!isLoading && !error && tasks.length === 0 && <p className="state-message">No tasks yet. Add your first study task.</p>}
          {!isLoading && !error && tasks.length > 0 && (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || 'No description added.'}</p>
                    <small>{task.subject_name} {task.due_date ? `| Due ${task.due_date}` : '| No due date'}</small>
                  </div>
                  <span className={`status status-${task.status}`}>{statusLabels[task.status] || task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
      <StudyPlanGenerator />
    </main>
  );
}