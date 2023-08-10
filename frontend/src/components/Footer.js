import React from 'react';

const date = new Date();

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        © {date.getFullYear()} Mesto Russia by Artur Khelshtein
      </p>
    </footer>
  );
}

export default Footer;
