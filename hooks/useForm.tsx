import { FormikConfig, FormikProvider, FormikValues, useFormik } from "formik";
import React, { ReactNode } from "react";

const useForm = <T extends FormikValues>(config: FormikConfig<T>) => {
  const formik = useFormik(config);

  const renderForm = (children: ReactNode) => {
    return <FormikProvider value={formik}>{children}</FormikProvider>;
  };

  return { ...formik, renderForm };
};

export default useForm;
