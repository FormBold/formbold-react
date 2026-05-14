# Formbold-react — The easiest way to configure and use Form in React/Next.js
React package for [FormBold](https://formbold.com/) which simplifies the integration of FormBold with React/Next.js projects.

FormBold is a multipurpose form API and serverless backend solution compatible with all hosting, SSG, and frameworks. It allows you to receive form submissions directly in your email, slack, telegram, notion, and more. It's ready for use with any Static, Jamstack, and SSG sites, such as HTML, React, Next.js, Gatsby, Vue, Nuxt, Hugo, and Jekyll.

It offers a wide range of form fields, advanced features like conditional logic, and seamless integration with other tools.

It helps you wire a form to FormBold with a small API, built-in validation for required fields, custom error messages, and basic submission state.

## Installation

```bash
npm install formbold-react
```

```bash
yarn add formbold-react
```

## Usage

Import `useForm`, pass your FormBold `formId`, and attach the returned `handleSubmit` function to your form.

```tsx
import { useForm } from "formbold-react";

function ContactForm() {
  const [state, handleSubmit] = useForm("form_id");

  if (state.succeeded) {
    return <div>Form submitted successfully.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" name="email" required />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required />

      <button type="submit">
        {state.submitting ? "Submitting..." : "Submit"}
      </button>

      {state.error.status && <p>{state.error.message}</p>}
    </form>
  );
}

export default ContactForm;
```

## API

### `useForm(formId, config?)`

```ts
const [state, handleSubmit] = useForm("form_id", config);
```

Returns:

```ts
[
  {
    error: { message: string; status: boolean };
    succeeded: boolean;
    submitting: boolean;
  },
  (event, recaptchaRef?) => void
]
```

### `config`

```ts
type Config = {
  requiredFields?: string[];
  errorMessages?: {
    empty?: string;
    required?: (fields: string[]) => string;
  };
};
```

Example:

```ts
const [state, handleSubmit] = useForm("form_id", {
  requiredFields: ["name", "email"],
  errorMessages: {
    empty: "Please fill the form!",
    required: fields => `Please fill the required fields: ${fields.join(", ")}`,
  },
});
```

### Required fields

Use `requiredFields` when you want the hook to block submission until specific inputs are filled.

```ts
const [state, handleSubmit] = useForm("form_id", {
  requiredFields: ["email"],
});
```

### reCAPTCHA support

If you use reCAPTCHA, pass the ref as the second argument to the submit handler.

```tsx
<form onSubmit={e => handleSubmit(e, recaptchaRef)}>
```

The hook will include `g-recaptcha-response` in the submitted payload when a ref is provided.

## Behavior notes

- Empty forms are rejected before the request is sent.
- Required field validation runs before submission.
- Non-2xx responses are treated as submission failures.
- Repeated form fields are preserved as arrays in the request payload.

## Types

The package exports its public types from the root entry point:

```ts
import type { Config, ErrorState, CaptchaRef } from "formbold-react";
```

## Links

- [FormBold docs](https://formbold.com/docs)
- [FormBold homepage](https://formbold.com/)
