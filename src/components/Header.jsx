import PropTypes from "prop-types";
import "../styles/Header.css";
import { useMemo } from "react";

const Header = (props) => {
  const { toggleSidebar, showSidebarToggle = true } = props;

  const _showButton = useMemo(() => {
    if (showSidebarToggle && toggleSidebar) {
      return (
        <button className="toggle-button" onClick={toggleSidebar}>
          ≡
        </button>
      );
    }
  }, [showSidebarToggle, toggleSidebar]);

  return (
    <header className="header">
      <img src="src/assets/logo.png" alt="Logo" className="logo" />
      <div className="header-title">EARLY WARNING SYSTEM</div>
      <img
        src="src/assets/brand-white.svg"
        alt="150 Years LOGO"
        className="logos"
      />
      {_showButton}
    </header>
  );
};

// Add PropTypes for validation
Header.propTypes = {
  toggleSidebar: PropTypes.func,
  showSidebarToggle: PropTypes.bool,
};

export default Header;
