import PropTypes from "prop-types";
import { useCallback } from "react";

const ElevationFilter = (props) => {

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
        <option>500-600</option>
        <option>600-700</option>
        <option>700-800</option>
        <option>0-800</option>
      </select>
    );
}

ElevationFilter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ElevationFilter;