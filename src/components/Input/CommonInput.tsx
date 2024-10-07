import React from 'react';

interface PropsTypes {
  labelClass: string;
  classname: string;
  htmlfor: string;
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  val?: string;
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Input(props: PropsTypes) {
  return (
    <>
      <label className={props.labelClass} htmlFor={props.htmlfor}>
        {props.label}
      </label>
      <input  
        id={props.id}
        name={props.name}
        type={props.type}
        required={props.required}
        value={props.val}
        onBlur={props.handleBlur}
        onChange={props.handleChange}
        className={props.classname}
      /></>
  )
}

export default Input