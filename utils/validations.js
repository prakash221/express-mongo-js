// validation function to text input fields
const validateTextInput = (input) => {
	if (typeof input !== 'string' || input.trim() === '') {
		return false; // Invalid input
	}
	return true; // Valid input
};

// validation function to email input fields
const validateEmailInput = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email); // Returns true if valid, false otherwise
};

// write a function to validate fields by taking an object, fields to validate and validation type (text or email)
export const validateFields = (data, fields, type) => {
	const errors = {};
	fields.forEach((field) => {
		if (type === 'text') {
			if (!validateTextInput(data[field])) {
				errors[field] = `${field} is required and must be a non-empty string.`;
			}
		} else if (type === 'email') {
			if (!validateEmailInput(data[field])) {
				errors[field] = `${field} must be a valid email address.`;
			}
		}
	});
    
	throw Object.keys(errors).length > 0
		? new Error(JSON.stringify(errors))
		: null;
};
