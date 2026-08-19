import { Link, Route, Routes } from 'react-router-dom';

function Layout({ children }) {
  return (
    <>
      <header>
        <Link to="/">StudyFlow</Link>
        <nav>
          <Link to="/login">Log in</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      {children}
    </>
  );
}

function HomePage() {
  return (
    <main>
      <h1>Plan your next study session.</h1>
      <p>StudyFlow keeps subjects, tasks, and study plans in one place.</p>
    </main>
  );
}

function LoginPage() {
  return <main><h1>Log in</h1><p>Authentication will be added in the next stage.</p></main>;
}

function DashboardPage() {
  return <main><h1>Dashboard</h1><p>Your study tasks will appear here.</p></main>;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Layout>
  );
}
