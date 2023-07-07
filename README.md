
# Formbold-react — The easiest way to configure and use Form in React/Next.js
React package for [FormBold](https://formbold.com/) which simplifies the integration of FormBold with React/Next.js projects.

FormBold is a multipurpose form API and serverless backend solution compatible with all hosting, SSG, and frameworks. It allows you to receive form submissions directly in your email, slack, telegram, notion, and more. It's ready for use with any Static, Jamstack, and SSG sites, such as HTML, React, Next.js, Gatsby, Vue, Nuxt, Hugo, and Jekyll.

It offers a wide range of form fields, advanced features like conditional logic, and seamless integration with other tools.

## Installation

```bash
npm install formbold-react
```

or

```bash
yarn add formbold-react
```

## Usages

To use it you have to import it in your Form component. Then call it with the form_id. 

And at the end, attach the handleSubmit function to the onSubmit event. 

```bash
import { useForm } from "formbold-react";

function Form() {
  const [state, handleSubmit] = useForm("form_id");

  if (state.succeeded) {
    return <div>Form submitted successfully</div>;
  }

  return (
    <>
      <h1>Home Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" name="email" required />
        <textarea id="message" name="message" required />
        <button type="submit">Submit</button>

        <div>
          {state.error && state.error.message}
        </div>
      </form>
    </>
  );
}

export default Form;
```

## ****Useful Links and Information****

For more information visit the [documentation](https://formbold.com/docs).
