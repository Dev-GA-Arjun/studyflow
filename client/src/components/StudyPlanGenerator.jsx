import { useState } from 'react';
import { generateStudyPlan } from '../services/aiService';

const initialForm = {
  subject: '',
  topics: '',
  hoursPerDay: '2',
  days: '5',
};

export default function StudyPlanGenerator() {
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setPlan([]);

    try {
      const generatedPlan = await generateStudyPlan({
        subject: form.subject,
        topics: form.topics,
        hoursPerDay: Number(form.hoursPerDay),
        days: Number(form.days),
      });
      setPlan(generatedPlan);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="ai-planner" aria-labelledby="ai-planner-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">StudyFlow AI</p>
          <h2 id="ai-planner-heading">Generate a study plan</h2>
        </div>
      </div>
      <form className="ai-form" onSubmit={handleSubmit}>
        <label>
          Subject
          <input name="subject" value={form.subject} onChange={handleChange} required maxLength="150" />
        </label>
        <label>
          Topics to cover
          <textarea name="topics" value={form.topics} onChange={handleChange} required rows="3" maxLength="2000" placeholder="Promises, async/await, error handling" />
        </label>
        <div className="form-row">
          <label>
            Hours per day
            <input type="number" name="hoursPerDay" value={form.hoursPerDay} onChange={handleChange} min="0.5" max="12" step="0.5" required />
          </label>
          <label>
            Number of days
            <input type="number" name="days" value={form.days} onChange={handleChange} min="1" max="30" required />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate plan'}
        </button>
      </form>
      {error && <p className="state-message error-message">{error}</p>}
      {plan.length > 0 && (
        <ol className="generated-plan">
          {plan.map((entry) => (
            <li key={entry.day}>
              <div>
                <h3>Day {entry.day}: {entry.topic}</h3>
                <p>{entry.goal}</p>
              </div>
              <span>{entry.durationMinutes} min</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}