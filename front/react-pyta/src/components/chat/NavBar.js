const Navbar = ({navButtons}) => (
    <nav id="nav-main">
      <section id="nav">
        <ul>
          {navButtons.map(button => {
            return ( 
              <li key={button.title} className="nav-link">
                <a className={`nav-link fas ${button.icon}`}title={button.title} onClick={button.onClick}></a>
              </li>
            )
          })}
        </ul>
      </section>
    </nav>
  );
  
  export default Navbar;