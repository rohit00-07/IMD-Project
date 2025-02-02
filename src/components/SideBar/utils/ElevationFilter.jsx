import PropTypes from "prop-types";
import { useCallback } from "react";

const ElevationFilter = (props) => {

    const {value, onChange} = props;

    const onChangeHandle = useCallback((e) => {
        const data = {
            elevation: e.target.value
        }
        e._data = data;
        onChange && onChange(e);
    }, [onChange]);

    return (
        <select
        value={value}
        onChange={onChangeHandle}
      >
        <option>500-600</option>
        <option>600-700</option>
        <option>700-800</option>
        <option>0-800</option>
      </select>
    );
}

ElevationFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ElevationFilter;