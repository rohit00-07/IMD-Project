import PropTypes from "prop-types";
import { useCallback } from "react";

const SuggestionItems = (props) => {
	const { key, onClick, item } = props;

    const onClickHandle = useCallback((e) => {
        const event = e; 
        event.__item = item;
        onClick && onClick(event);
    }, [item, onClick]);

	return (
		<li key={key} onClick={onClickHandle}>
			{item}
		</li>
	);

}

SuggestionItems.propTypes = {
  key: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  item: PropTypes.string.isRequired,
}

export default SuggestionItems;