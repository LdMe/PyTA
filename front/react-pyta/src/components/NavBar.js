const Navbar = ({navButtons}) => (
    <nav id="nav-main">
      <section id="nav">
        <ul>
          <li className="nav-link">
            <a className="fas fa-home nav-link" href="/" title="Inicio"></a>
          </li>
          <li className="nav-link">
            <a className="fas fa-file-invoice nav-link" href="/templates" title="Plantillas"></a>
          </li>
          {navButtons.map(button => button)}
        </ul>
      </section>
    </nav>
  );
  
  export default Navbar;