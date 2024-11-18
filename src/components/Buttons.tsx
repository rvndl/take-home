import { FC, useState } from "react";
import { XMarkIcon } from "./icons";

type ButtonProps = React.ComponentProps<"button">;

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="hover:text-gray-700 transition-colors flex items-center justify-center"
      {...props}
    >
      {children}
    </button>
  );
};

export const DeleteButton: FC<Omit<ButtonProps, "children">> = (props) => {
  return (
    <Button {...props}>
      <XMarkIcon />
    </Button>
  );
};

export const ActionButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
      {...props}
    />
  );
};

type ToggleButtonProps = {
  isDefaultToggled?: boolean;
  toggledText: string;
  untoggledText: string;
  onToggle: (isToggled: boolean) => void;
} & Omit<ButtonProps, "onClick" | "children">;

export const ToggleButton: FC<ToggleButtonProps> = ({
  isDefaultToggled,
  onToggle,
  toggledText,
  untoggledText,
  ...rest
}) => {
  const [isToggled, setIsToggled] = useState(isDefaultToggled);

  const handleOnToggle = () => {
    const inversion = !isToggled;

    setIsToggled(inversion);
    onToggle(inversion);
  };

  return (
    <Button
      className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
      onClick={handleOnToggle}
      {...rest}
    >
      {isToggled ? toggledText : untoggledText}
    </Button>
  );
};
