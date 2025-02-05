import PropTypes from "prop-types";
import "../styles/Header.css";

const Header = (props) => {
	const { toggleSidebar, showSidebarToggle = true } = props;

	return (
		<header className="header">
			<img src="src/assets/logo.png" alt="Logo" className="logo" />
			<div className="header-title">EARLY WARNING SYSTEM</div>
			<img src="src/assets/IMD_150.webp" alt="150 Years LOGO" className="logos"/>
			{showSidebarToggle && toggleSidebar && (
				<button className="toggle-button" onClick={toggleSidebar}>
					≡
				</button>
			)}
		</header>
	);
};

// Add PropTypes for validation
Header.propTypes = {
	toggleSidebar: PropTypes.func,
};

export default Header;
