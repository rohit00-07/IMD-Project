import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { TopologyTypes } from "../../../constants/TopologyConstants";

const TopologyFilter = (props) => {
	const { value, onChange } = props;

	const onChangeHandle = useCallback((e) => {
		const data = {
			topology: e.target.value,
		};
		e._data = data;
		onChange && onChange(e);
	},	[onChange]);

    const _renderTopologyOptions = useMemo(() => {
        return (Object.values(TopologyTypes).map((value) => (
            <option key={"topology-type-"+value}>{value}</option>
          )))
    }, []);

	return (
		<select value={value} onChange={onChangeHandle}>
            {_renderTopologyOptions}
		</select>
	);
};

TopologyFilter.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default TopologyFilter;
