import { cn } from "@/lib/utils";
import Image from "next/image";
import { type UseFormRegister } from "react-hook-form";

import ChevronDown from "@/assets/chevron-down.svg";

type Options = { value: string; label: string };

interface InputFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  type?: string;
  placeholder?: string;
  options?: Options[];
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  defaultOption?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  register,
  error,
  options,
  disabled,
  className,
  autoFocus,
  type = "text",
  placeholder = "",
  defaultOption,
}) => {
  const isSelect = type === "select";
  const isEmail = type === "email";

  return (
    <div className={cn("flex flex-col mb-3", className)}>
      <label className="font-semibold" htmlFor={name}>
        {label}
      </label>
      {isSelect && options ? (
        <div className="relative mt-4 bg-gray-100 rounded-[10px]">
          <select
            id={name}
            autoFocus={autoFocus}
            disabled={disabled}
            {...register(name, { required: `${label} is required` })}
            className="h-12  rounded-[10px] p-1 px-4 appearance-none w-full bg-transparent focus:outline-none focus:ring focus:ring-primary"
          >
            {options.map((option) => (
              <option key={option.value} value={defaultOption ?? option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute top-1/2 transform -translate-y-1/2 right-2 pointer-events-none">
            <Image src={ChevronDown} alt="chevron-down" />
          </div>
        </div>
      ) : (
        <input
          type={type}
          id={name}
          key={name}
          min={0}
          max={100}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "h-12 bg-gray-100 mt-4 rounded-[10px] px-5 outline-0 focus:ring-2 focus:ring-black disabled:text-gray-500 disabled:cursor-not-allowed",
            {
              "ring-2 ring-red-700 bg-red-100 focus:ring-red-700": !!error,
            }
          )}
          {...register(name, { required: `${label} is required` })}
        />
      )}
      <span
        className={cn("text-red-700 text-xs mt-2 h-2", {
          "opacity-1": error,
          "opacity-0": !error,
        })}
      >
        {error ?? ""}
      </span>
    </div>
  );
};

{
}
export default InputField;
