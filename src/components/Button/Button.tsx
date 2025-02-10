type ButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  text: string;
  variant?: 'default' | 'destructive' | 'secondary';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const buttonVariantClasses = {
  default: ' bg-indigo-600 text-white rounded',
  destructive: 'bg-red-600 text-white rounded',
  secondary:
    'bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600',
};

export function Button({
  onClick,
  type = 'button',
  text,
  variant = 'default',
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 ${buttonVariantClasses[variant]}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {text}
    </button>
  );
}
