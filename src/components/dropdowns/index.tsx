import { Field } from 'formik'
import _map from "lodash/map";
import _get from 'lodash/get';

interface DropdownProps {
  name: string;
  label: string;
  options: Array<{ val: string; label: string }>; 
}

function Dropdown(props: DropdownProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor="role"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {props.label}
      </label>
      <Field
        as="select"
        id={props.name}
        name={props.name}
        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
          {_map(_get(props, "options", []), (option) => {
          <option value={option.val} label={option.label} />
        })}
      </Field>
    </div>
  )
}

export default Dropdown