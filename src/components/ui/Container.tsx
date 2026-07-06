import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  as: Component = "div",
  id,
}) => {
  return (
    <Component
      id={id}
      className={`w-full max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 ${className}`}
    >
      {children}
    </Component>
  );
};

export default Container;
