"use client";

import { createContext, useContext, useState } from "react";

type FormData = {
        name: string;
        email: string;
        phone: string;
        businessName: string;
        businessType: string;
        revenue: string;
        bottleneck: string;
        teamSize: string;
    };
      ;


type FormContextType = {
  data: FormData;
  updateField: (field: keyof FormData, value: string) => void;
};

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "",
        revenue: "",
        bottleneck: "",
        teamSize: "",
      });
      

  const updateField = (field: keyof FormData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <FormContext.Provider value={{ data, updateField }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
