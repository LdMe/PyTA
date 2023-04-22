const Navbar = () => (
    <nav id="nav-main">
      <section id="nav">
        <ul>
          <li className="nav-link">
            <a className="fas fa-home nav-link" href="/" title="Inicio"></a>
          </li>
          <li className="nav-link">
            <a className="fas fa-file-invoice nav-link" href="/templates" title="Plantillas"></a>
          </li>
          {/*{% block nav_links %}{% endblock %}*/}
        </ul>
      </section>
    </nav>
  );
  
  export default Navbar;