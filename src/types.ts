
/**
 * Error state for the useForm hook.
 */
export type ErrorState = {
/** The error message */
message: string;
/** The error status */
status: boolean;
};
  
/**
 * Error messages for the useForm hook.
 */
export type ErrorMessages = {
/** Error message when the form is empty */
empty: string;
/** Error message when the required fields are empty */
required: (fields: string[]) => string;
};
  
/**
 * Configuration options for the useForm hook.
 */
export type Config = {
/** 
 * Custom error messages
 * 
 * @example
 * errorsMessages: {
 *  empty: 'Oops the form is empty!',
 *  required: fields => `You missed: ${fields.join(', ')}`,
 * }
 */
errorsMessages?: ErrorMessages;
/** 
 * List of required fields (by name) that must be filled before submitting the form.
 * @default []
 * 
 * @example
 * requiredFields: ['name', 'email']
 */
requiredFields?: string[];
};
  

export type CaptchaRef = { current: { getValue: () => any } };