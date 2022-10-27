import { Formik, useField, useFormik } from 'formik';
import REACTDOM from 'react-dom';
import * as Yup from 'yup';

export default function Form(){
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      company:'',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      company: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address')
        .required('Required'),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="sm:flex items-center justify-center text-center bg-light text-dark text-xl font-medium dark:bg-dark dark:text-light">
        <div className="max-w-3xl p-8 sm:m-8 border-2 border-lightgray shadow-xl text-center grid grid-flow-row auto-rows-max">
          <div className="pb-4 text-primary text-2xl font-bold border-b-2 mb-4">
            <header />Driver Application Form
          </div>
          <div className="grid grid-cols-2 gap-x-8 text-start">

            {/* First name */}
            <div className="block mb-4">
              <label htmlFor="firstName">First name</label>
              <input 
                className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md"
                id="firstName"
                type="text"
                placeholder="John"
                // auto generates: name, value, handleChange, handleBlur
                {...formik.getFieldProps('firstName')}
              />
              {formik.touched.firstName && formik.errors.firstName ? <div className="text-red-500 text-lg">{formik.errors.firstName}</div> : null}
            </div>

            {/* Last name */}
            <div className="block mb-4">
              <label htmlFor="lastName">Last name</label>
              <input 
                className="w-full px-4 py-2 border-2 border-lightgray shadow-md"
                id="lastName"
                type="text"
                placeholder="Doe"
                {...formik.getFieldProps('lastName')}
              />
              {formik.touched.lastName && formik.errors.lastName ? <div className="text-red-500 text-lg">{formik.errors.lastName}</div> : null}
            </div>

            {/* Company */}
            <div className="block mb-4">
              <label htmlFor="company">Company</label>
              <input 
                className="w-full px-4 py-2 border-2 border-lightgray shadow-md"
                id="company"
                type="text"
                placeholder="Name"
                {...formik.getFieldProps('company')}
              />
              {formik.touched.company && formik.errors.company ? <div className="text-red-500 text-lg">{formik.errors.company}</div> : null}
            </div>

          </div>
          {/* Email */} 
          <div className="block mb-4 text-start">
            <label htmlFor="email">Email address</label>
            <input
              className="w-full block px-4 py-2 border-2 border-lightgray shadow-md"
              id="email"
              type="email"
              placeholder="johndoe@gmail.com"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-lg">{formik.errors.email}</div> : null}
          </div>

          {/* Reason for application */} 
          <div className="block text-start">
            <label htmlFor="reason">Reason for application</label>
            <textarea className="w-full block px-4 py-4 mb-4 border-2 border-lightgray shadow-md" id="large-input" placeholder="Leave a message..."/>
          </div>

          {/* Submit */} 
          <div className="block text-center">
            <button className="px-4 py-2 border-2 border-lightgray dark:border-darkgray dark:bg-dark hover:border-primary hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark dark:hover:border-primary shadow-md"
                    type="submit">
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}