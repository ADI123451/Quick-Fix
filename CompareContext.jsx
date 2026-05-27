import { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (vendor) => {
    setCompareList((prev) => {
      const exists = prev.find((v) => v.id === vendor.id);
      if (exists) return prev.filter((v) => v.id !== vendor.id);
      if (prev.length >= 3) return [prev[1], prev[2], vendor]; // max 3
      return [...prev, vendor];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
