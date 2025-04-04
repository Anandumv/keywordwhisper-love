import SimpleKeywordGenerator from "./components/SimpleKeywordGenerator";
import './index.css';

const App = () => {
  return (
    <>
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <span>TrendWhisper</span>
        </div>
        <nav className="navigation">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>
      </header>
    
      <div className="app" style={{ padding: '7rem 2rem 4rem', minHeight: '100vh' }}>
        <SimpleKeywordGenerator />
      </div>
    </>
  );
};

export default App;
