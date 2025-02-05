import PropTypes from "prop-types";
import { useCallback } from "react";

const RadiusFilter = (props) => {

    const {name, value, onChange} = props;

    const onChangeHandle = useCallback((e) => {
      const selectedValue = e.target.value;
      onChange && onChange({ ...e, _data: { [name]: selectedValue } });
    }, [onChange, name]);

    return (
		<select
			value={value}
      onChange={onChangeHandle}
      name={name} 
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
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default RadiusFilter;