/**
 * Footer Component
 * Single Responsibility: Display footer information
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Fatesblind. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
