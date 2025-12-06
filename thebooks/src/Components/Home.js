
import "../index.css";

export default function Home() {
  return (
    <main className="home">
      <div className="welcome-section">
        <h1>Welcome to <span className="highlight">The Books</span></h1>
        <p className="quote">
          "A reader lives a thousand lives before he dies. The man who never reads lives only one."
        </p>
        <p className="author">— George R.R. Martin</p>

        <div className="intro">
          <p>
            Discover a world of knowledge, adventure, and imagination.  
            Explore our collection and borrow your favorite books with ease.
          </p>
        </div>
      </div>
    </main>
  );
}
