import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { TopologyTypes } from "../../../constants/TopologyConstants";

const TopologyFilter = (props) => {
	const { name, value, onChange } = props;

	const onChangeHandle = useCallback((e) => {
		const selectedValue = e.target.value;

        onChange && onChange({ ...e, _data: { [name]: selectedValue } });
    }, [onChange, name]);

    const _renderTopologyOptions = useMemo(() => {
        return (Object.values(TopologyTypes).map((value) => (
            <option key={"topology-type-"+value}>{value}</option>
          )))
    }, []);

	return (
		<select 
			value={value} 
			onChange={onChangeHandle}
			name={name}
		>
            {_renderTopologyOptions}
		</select>
	);
};

TopologyFilter.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default TopologyFilter;
