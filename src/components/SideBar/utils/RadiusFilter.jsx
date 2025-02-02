import PropTypes from "prop-types";
import { useCallback } from "react";

const RadiusFilter = (props) => {

    const {value, onChange} = props;

    const onChangeHandle = useCallback((e) => {
        const data = {
            radius: e.target.value
        }
        e._data = data;
        onChange && onChange(e);
    }, [onChange]);

    return (
		<select
			value={value}
            onChange={onChangeHandle}
		>
			<option>5</option>
			<option>10</option>
			<option>15</option>
			<option>20</option>
			<option>50</option>
			<option>100</option>
		</select>
	);
}

RadiusFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default RadiusFilter;