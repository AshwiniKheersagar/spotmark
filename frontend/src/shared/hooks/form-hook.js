import { useCallback, useReducer } from "react";

// Reducer function to manage form state
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;

      for (const inputId in state.inputs) {
        if(!state.inputs.hasOwnProperty(inputId)) continue;
        if (!state.inputs[inputId]) continue; // Prevents errors in case of undefined fields

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
};

/**
 * Custom hook to manage form state.
 * @param {object} initialInputs - Initial state for form inputs.
 * @param {boolean} initialFormValidity - Initial validity of the form.
 * @returns {[object, function, function]} - Returns form state, input handler, and setFormData function.
 */
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity, // State for the entire form
  });

  // Handles changes in form inputs
  const inputHandler = useCallback(
    (id, value, isValid) => {
      dispatch({
        type: "INPUT_CHANGE",
        value: value,
        isValid: isValid,
        inputId: id,
      });
    },
    [dispatch] // Added dispatch to dependencies
  );

  // Sets form data dynamically (useful for prefilling form data)
  const setFormData = useCallback(
    (inputData, formValidity) => {
      dispatch({
        type: "SET_DATA",
        inputs: inputData,
        formIsValid: formValidity,
      });
    },
    [dispatch] // Added dispatch to dependencies
  );

  return [formState, inputHandler, setFormData];
};
