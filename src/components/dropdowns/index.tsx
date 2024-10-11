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
      <label htmlFor={props.name} className="block text-gray-700">{props.label}</label>
      <Field
        name={props.name}
        as="select"
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="" label="Select Workspace admin" />
        {_map(_get(props, "options", []), (option, ind) =>
          <option key={ind+option.val} value={option.val} label={option.label} />
        )}
      </Field>
    </div>
  )
}

export default Dropdown