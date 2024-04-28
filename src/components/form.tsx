import { JSX } from "preact/jsx-runtime";

import formStyles from "./form.module.css";

export default function Form(props: JSX.IntrinsicElements["form"]) {
  return (
    <form
      class={formStyles.form + (props.class ? " " + props.class : "")}
      {...props}
    />
  );
}
