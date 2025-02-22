type ValidationRule = {
	test: (value: string) => boolean;
	message: string;
};

type ValidationRules = {
	[key: string]: ValidationRule[];
};

export const commonValidations = {
	required: {
		test: (value: string) => value.trim().length > 0,
		message: 'This field is required'
	},
	email: {
		test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
		message: 'Please enter a valid email address'
	},
	minLength: (min: number) => ({
		test: (value: string) => value.length >= min,
		message: `Must be at least ${min} characters`
	}),
	url: {
		test: (value: string) => {
			return true;
		},
		message: 'Please enter a valid URL'
	}
};

export type FormValidationRules = {
	article: {
		headline: ValidationRule[];
		body: ValidationRule[];
		image_url: ValidationRule[];
		created_by: ValidationRule[];
	};
	author: {
		first_name: ValidationRule[];
		last_name: ValidationRule[];
		prompt: ValidationRule[];
		image_url: ValidationRule[];
	};
	auth: {
		username: ValidationRule[];
		password: ValidationRule[];
	};
};

export const formValidationRules: FormValidationRules = {
	article: {
		headline: [commonValidations.required],
		body: [commonValidations.required],
		image_url: [commonValidations.required, commonValidations.url],
		created_by: [commonValidations.required]
	},
	author: {
		first_name: [commonValidations.required],
		last_name: [commonValidations.required],
		prompt: [commonValidations.required],
		image_url: [commonValidations.required, commonValidations.url]
	},
	auth: {
		username: [commonValidations.required],
		password: [commonValidations.required, commonValidations.minLength(4)]
	}
};

export const validateField = (
	value: string,
	rules: ValidationRule[]
): string => {
	for (const rule of rules) {
		if (!rule.test(value)) {
			return rule.message;
		}
	}
	return '';
};

export const validateForm = <
	T extends { [K in keyof U]: string },
	U extends ValidationRules
>(
	formData: T,
	validationRules: U
): { isValid: boolean; errors: Partial<T> } => {
	const errors: Partial<T> = {};
	let isValid = true;

	Object.keys(validationRules).forEach((field) => {
		const error = validateField(formData[field] || '', validationRules[field]);
		if (error) {
			errors[field as keyof T] = error as T[keyof T];
			isValid = false;
		}
	});

	return { isValid, errors };
};
