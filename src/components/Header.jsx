import PropTypes from "prop-types";
import "../styles/Header.css";

const Header = (props) => {
	const { toggleSidebar } = props;

	return (
		<header className="header">
			<img src="src/assets/logo.png" alt="Logo" className="logo" />
			<div className="header-title">EARLY WARNING SYSTEM</div>
			<button className="toggle-button" onClick={toggleSidebar}>
				≡
			</button>
		</header>
	);
};

// Add PropTypes for validation
Header.propTypes = {
	toggleSidebar: PropTypes.func.isRequired, // Ensures toggleSidebar is a required function
};

export default Header;
