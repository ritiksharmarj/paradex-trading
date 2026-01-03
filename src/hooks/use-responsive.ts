import * as React from "react";

export const useMediaQuery = (query: string) => {
  const [value, setValue] = React.useState(false);

  const handleChange = React.useCallback(
    (event: MediaQueryListEvent) => setValue(event.matches),
    [],
  );

  React.useEffect(() => {
    const result = matchMedia(query);
    result.addEventListener("change", handleChange);

    setValue(result.matches);

    return () => result.removeEventListener("change", handleChange);
  }, [query, handleChange]);

  return value;
};

export const useResponsive = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  return {
    isDesktop,
    isMobile,
  };
};
