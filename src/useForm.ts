import { useState, type SyntheticEvent } from 'react';
import { CaptchaRef, Config, DeepRequired, ErrorState, FormValues } from './types';
import { isValueEmpty, mergeConfig, toFormValues } from './utils';

const defaultConfig: DeepRequired<Config> = {
  errorMessages: {
    empty: 'Please fill the form!',
    required: (fields: string[]) => `Please fill the required fields: ${fields.join(', ')}`,
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
  const { requiredFields, errorMessages } = mergeConfig(defaultConfig, config);
  const [error, setError] = useState<ErrorState>(defaultErrorState);
  const [succeeded, setSucceeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>, recaptchaRef?: CaptchaRef) => {
    e.preventDefault();
    setSucceeded(false);

    const formData = new FormData(e.currentTarget);
    const value = toFormValues(formData);
    const finalData: FormValues = { ...value };

    if (recaptchaRef) {
      finalData['g-recaptcha-response'] = recaptchaRef.current.getValue();
    }

    const isEmpty = Object.values(value).every((entry: FormDataEntryValue | FormDataEntryValue[]) =>
      isValueEmpty(entry),
    );
    if (isEmpty) {
      setSucceeded(false);
      return setError({
        message: errorMessages.empty,
        status: true,
      });
    }

    const requiredFieldsEmpty = requiredFields.filter(field => isValueEmpty(value[field]));

    if (requiredFieldsEmpty.length > 0) {
      setSucceeded(false);
      return setError({
        message: errorMessages.required(requiredFieldsEmpty),
        status: true,
      });
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${FORM_BOLD_SUBMISSION_API}/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const fallbackMessage = `Submission failed with status ${response.status}`;
        const responseMessage = await response.text().catch(() => '');

        throw new Error(responseMessage || fallbackMessage);
      }

      setSucceeded(true);
      setError(defaultErrorState);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Something went wrong while submitting the form.';

      setError({
        message,
        status: true,
      });
      setSucceeded(false);
    } finally {
      setSubmitting(false);
    }
  };

  return [{ error, succeeded, submitting }, handleSubmit] as const;
};

export { useForm };
