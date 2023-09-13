import { useState } from "react";

type ErrorState = {
  message: string;
  status: boolean;
};

const useForm = (formId: string) => {
  const [error, setError] = useState<ErrorState>({
    message: "",
    status: false,
  });
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    recaptchaRef?: { current: { getValue: () => any } }
  ) => {
    e.preventDefault();

    // Getting the Form data
    const data = new FormData(e.currentTarget);
    //@ts-ignore
    const value = Object.fromEntries(data.entries());
    const finalData = { ...value };

    // Conditionally add "g-recaptcha-response" if recaptchaRef is provided
    if (recaptchaRef) {
      finalData["g-recaptcha-response"] = recaptchaRef.current.getValue();
    }

    //check if the values is empty
    //@ts-ignore
    const isEmpty = !Object.values(value).some((x) => x !== null && x !== "");
    if (isEmpty) {
      return setError({
        message: "Please fill the form!",
        status: true,
      });
    }

    // submit the form
    fetch(`https://formbold.com/s/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => {
        setSucceeded(true);
      })
      .catch((error) => {
        setError({
          message: error.message,
          status: true,
        });
        setSucceeded(false);
      });
  };

  return [{ error, succeeded }, handleSubmit] as const;
};

export { useForm };
