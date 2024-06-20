import { useState } from "react";
import { CaptchaRef, Config, ErrorState } from "./types";
import { mergeConfig } from "./utils";


const defaultConfig: Required<Config> = {
  errorsMessages: {
    empty: 'Please fill the form!',
    required: fields => `Please fill the required fields: ${fields.join(', ')}`,
  },
  requiredFields: [],
};

const defaultErrorState: ErrorState = {
  message: '',
  status: false,
};

const FORM_BOLD_SUBMISSION_API = 'https://formbold.com/s';

/**
 * FormBold useForm hook
 * @param formId - The form ID
 * @param config - Configuration options
 * @returns An array containing the form state and the submit handler
 */
const useForm = (formId: string, config?: Config) => {
  const { requiredFields, errorsMessages } = mergeConfig(defaultConfig, config);

  const [error, setError] = useState<ErrorState>(defaultErrorState);
  const [succeeded, setSucceeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, recaptchaRef?: CaptchaRef) => {
    e.preventDefault();

    // Getting the Form data
    const data = new FormData(e.currentTarget);
    //@ts-ignore
    const value = Object.fromEntries(data.entries());
    const finalData = { ...value };

    // Conditionally add "g-recaptcha-response" if recaptchaRef is provided
    if (recaptchaRef) {
      finalData['g-recaptcha-response'] = recaptchaRef.current.getValue();
    }

    //check if the values is empty
    //@ts-ignore
    const isEmpty = !Object.values(value).some(x => x !== null && x !== '');
    if (isEmpty) {
      return setError({
        message: errorsMessages.empty,
        status: true,
      });
    }

    // Check if the required fields are empty
    const requiredFieldsEmpty = requiredFields.filter(field => !value[field]);

    if (requiredFieldsEmpty.length > 0) {
      return setError({
        message: errorsMessages.required(requiredFieldsEmpty),
        status: true,
      });
    }

    setSubmitting(true);

    // submit the form
    fetch(`${FORM_BOLD_SUBMISSION_API}/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    })
      .then(res => {
        setSucceeded(true);
      })
      .catch(error => {
        setError({
          message: error.message,
          status: true,
        });
        setSucceeded(false);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return [{ error, succeeded, submitting }, handleSubmit] as const;
};


export { useForm };
