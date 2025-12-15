import { Switch } from "@heroui/react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

import { useDarkMode } from "~/hooks/use-dark-mode";

export const ModeSwitch = () => {
  const [mode, setMode] = useDarkMode();
  return (
    <Switch
      isSelected={mode === "dark"}
      isDisabled={mode === "auto"}
      onChange={(selected) => setMode(selected ? "dark" : "light")}
      className="gap-1.5"
    >
      <IoSunnyOutline />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <IoMoonOutline />
    </Switch>
  );
};
