import logo from './logo.svg';
import './App.css';
import './style.css';
import Index from './components';
import Navbar from './components/NavBar';
function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Index />
      </main>
    </div>
  );
}

export default App;
