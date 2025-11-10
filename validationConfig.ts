export const loginValidationConfig = {
  email: [
    {
      test: (value: string) => !!value && value.trim().length > 0,
      errorMessage: 'Email is required',
    },
    {
      test: (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value),
      errorMessage: 'Enter a valid email address',
    },
  ],
};
export const blogsValidationConfig = {
  title: [
    { test: (v: string) => !!v, errorMessage: 'Title is required' },
    { test: (v: string) => v.length >= 3, errorMessage: 'Title must be at least 3 characters' }
  ],
  subtitle: [
    { test: (v: string) => !v || v.length >= 3, errorMessage: 'Subtitle must be at least 3 characters' }
  ],
  image: [
    {
      test: (v: any) => true,
      errorMessage: 'Image is required'
    }
  ],
  content: [
    { test: (v: string) => !!v, errorMessage: 'Description is required' },
    { test: (v: string) => v.length >= 10, errorMessage: 'Description must be at least 10 characters' }
  ]
};
// Centralized validation config for all sections

export const aboutValidationConfig = {
  name: [
    { test: (v: string) => !!v, errorMessage: 'Name is required' },
    { test: (v: string) => v.length >= 2, errorMessage: 'Name must be at least 2 characters' }
  ],
  title: [
    { test: (v: string) => !!v, errorMessage: 'Title is required' }
  ],
  email: [
    { test: (v: string) => !!v, errorMessage: 'Email is required' },
    { test: (v: string) => /.+@.+\..+/.test(v), errorMessage: 'Enter a valid email address' }
  ],
  location: [
    { test: (v: string) => !!v, errorMessage: 'Location is required' }
  ],
  bio: [
    { test: (v: string) => !!v, errorMessage: 'Bio is required' },
    { test: (v: string) => v.length >= 10, errorMessage: 'Bio must be at least 10 characters' }
  ]
};

export const experienceValidationConfig = {
  organisation: [
    { test: (v: string) => !!v, errorMessage: 'Organisation is required' }
  ],
  designation: [
    { test: (v: string) => !!v, errorMessage: 'Designation is required' }
  ],
  from: [
    { test: (v: string) => !!v, errorMessage: 'Start date is required' }
  ],
  to: [], // Optional
  description: [
    { test: (v: string) => !!v, errorMessage: 'Description is required' },
    { test: (v: string) => v.length >= 10, errorMessage: 'Description must be at least 10 characters' }
  ]
};

export const achievementsValidationConfig = {
  title: [
    { test: (v: string) => !!v, errorMessage: 'Achievement title is required' }
  ],
  year: [
    { test: (v: string) => !!v, errorMessage: 'Year is required' },
    { test: (v: string) => /^[0-9]{4}$/.test(v), errorMessage: 'Enter a valid year' }
  ],
  description: [
    { test: (v: string) => !!v, errorMessage: 'Description is required' }
  ]
};

export const contactValidationConfig = {
  method: [
    { test: (v: string) => !!v, errorMessage: 'Contact method is required' }
  ],
  value: [
    { test: (v: string) => !!v, errorMessage: 'Contact value is required' }
  ]
};

export const projectsValidationConfig = {
  title: [
    { test: (v: string) => !!v, errorMessage: 'Project title is required' },
    { test: (v: string) => v.length >= 3, errorMessage: 'Title must be at least 3 characters' }
  ],
  description: [
    { test: (v: string) => !!v, errorMessage: 'Description is required' },
    { test: (v: string) => v.length >= 10, errorMessage: 'Description must be at least 10 characters' }
  ],
  link: [
    { test: (v: string) => !v || /^https?:\/\/.+\..+/.test(v), errorMessage: 'Enter a valid URL' }
  ]
};
