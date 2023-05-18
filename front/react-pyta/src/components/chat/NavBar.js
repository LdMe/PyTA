import './NavBar.scss';

const Navbar = ({navButtons}) => (
    <nav id="nav-main">
      <section id="nav">
        <ul>
          {navButtons.map(button => {
            return ( 
              <li key={button.title} className="nav-link">
                <a className={button.icon !=='' ? `nav-link fas ${button.icon}`:''}title={button.title} onClick={button.onClick}>
                  {button.html ? button.html : ''}
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </nav>
  );
  
  export default Navbar;