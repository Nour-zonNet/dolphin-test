import { useState, useEffect, useCallback } from "react";
import { useClasses } from "@/hooks/useClasses";

export const useSiblingsState = () => {
  const [hasSiblings, setHasSiblings] = useState(null);
  const { classes, loading, getClasses } = useClasses();

  // Load classes on component mount
  useEffect(() => {
    getClasses();
  }, [getClasses]);

  const handleSiblingsChoice = useCallback((choice) => {
    setHasSiblings(choice);
  }, []);

  return {
    hasSiblings,
    setHasSiblings,
    handleSiblingsChoice,
    classes,
    loading,
  };
};
