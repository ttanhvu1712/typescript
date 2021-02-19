namespace App {
  // Validation
  export type Validatable = {
    value: string | number
    require?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }

  export function validate(validatableInput: Validatable): boolean {
    let isValid = true
    if (validatableInput.require && typeof validatableInput.value === 'string') {
      isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
      isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
      isValid = isValid && validatableInput.value.toString().trim.length <= validatableInput.maxLength
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value >= validatableInput.min
    }

    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value <= validatableInput.max
    }

    return isValid
  }
}
