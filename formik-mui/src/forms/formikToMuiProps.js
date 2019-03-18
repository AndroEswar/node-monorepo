import {getIn} from 'formik';
import dateFormat from '../date/toStr';

export default function({
	field = {},
	form = {},
	disabled = false,
	error,
	multiple,
	checked,
	...props
}) {
	const {name, onChange} = field;
	const {errors = {}, touched = {}, isSubmitting, dirty} = form;

	const fErr = getIn(errors, name);
	window.getIn = getIn;
	const fieldError = (dirty || getIn(touched, name)) && typeof fErr === 'string' ? fErr : null;

	const extraProps = {};

	if (onChange) {
		switch (props.type) {
			case 'select':
				field.value = typeof field.value === 'undefined' ? multiple ? [] : '' : field.value;
				break;

			case 'checkbox':
				field.value = typeof field.value === 'undefined' ? '' : field.value === true ? 'checked' : field.value || '';
				extraProps.checked = typeof checked !== 'undefined' ? checked : field.value ? 'checked' : '';
				break;

			case 'file':
				field.value = typeof field.value === 'undefined' ? [] : field.value;
				break;

			case 'date':
				field.value = typeof field.value === 'undefined' ? '' : dateFormat(field.value, 'YYYY-MM-DD');
				break;

			default: typeof field.value === 'undefined' ? '' : field.value;
		}
	}

	return {
		disabled: isSubmitting || disabled,
		...props,
		...field,
		...extraProps,
		error: error || Boolean(fieldError),
		helperText: fieldError || props.helperText,
	};
}
