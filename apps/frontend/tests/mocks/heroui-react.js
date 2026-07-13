const React = require('react');

function makeSlot(tag, displayName) {
  const Component = React.forwardRef(function Slot({ children, ...props }, ref) {
    return React.createElement(tag, { ref, ...props }, children);
  });
  Component.displayName = displayName;
  return Component;
}

// --- Button -----------------------------------------------------------
const Button = React.forwardRef(function Button(
  { children, onPress, isDisabled, variant, size, fullWidth, ...props },
  ref,
) {
  return React.createElement(
    'button',
    { ref, disabled: isDisabled, onClick: onPress, ...props },
    children,
  );
});

function buttonVariants() {
  return 'btn';
}

// --- Card ---------------------------------------------------------------
const Card = makeSlot('div', 'Card');
Card.Header = makeSlot('div', 'Card.Header');
Card.Title = makeSlot('h2', 'Card.Title');
Card.Description = makeSlot('p', 'Card.Description');
Card.Content = makeSlot('div', 'Card.Content');
Card.Footer = makeSlot('div', 'Card.Footer');

// --- TextField / Label / Input / FieldError -----------------------------
const TextFieldContext = React.createContext(null);

function TextField({ children, value, onChange, onBlur, isInvalid, fullWidth, ...props }) {
  const id = React.useId();

  return React.createElement(
    TextFieldContext.Provider,
    { value: { id, value, onChange, onBlur, isInvalid } },
    React.createElement('div', props, children),
  );
}

function Label({ children, ...props }) {
  const ctx = React.useContext(TextFieldContext);

  return React.createElement('label', { htmlFor: ctx?.id, ...props }, children);
}

function Input({ type = 'text', ...props }) {
  const ctx = React.useContext(TextFieldContext);

  return React.createElement('input', {
    id: ctx?.id,
    type,
    value: ctx?.value ?? '',
    onChange: (e) => ctx?.onChange?.(e.target.value),
    onBlur: ctx?.onBlur,
    'aria-invalid': ctx?.isInvalid ? 'true' : undefined,
    ...props,
  });
}

function FieldError({ children }) {
  if (!children) {
    return null;
  }

  return React.createElement('span', { role: 'alert' }, children);
}

// --- Select / ListBox -----------------------------------------------------
const SelectContext = React.createContext(null);

function Select({ children, selectedKey, onSelectionChange, isDisabled, ...props }) {
  return React.createElement(
    SelectContext.Provider,
    { value: { selectedKey, onSelectionChange, isDisabled } },
    React.createElement('div', props, children),
  );
}
Select.Trigger = makeSlot('div', 'Select.Trigger');
Select.Value = function Value() {
  const ctx = React.useContext(SelectContext);

  return React.createElement('span', null, ctx?.selectedKey);
};
Select.Indicator = function Indicator() {
  return null;
};
Select.Popover = makeSlot('div', 'Select.Popover');

function ListBox({ children, ...props }) {
  return React.createElement('div', { role: 'listbox', ...props }, children);
}
ListBox.Item = function Item({ id, children }) {
  const ctx = React.useContext(SelectContext);

  return React.createElement(
    'button',
    {
      type: 'button',
      role: 'option',
      disabled: ctx?.isDisabled,
      onClick: () => ctx?.onSelectionChange?.(id),
    },
    children,
  );
};

// --- Toast ----------------------------------------------------------------
const toast = {
  success: jest.fn(),
  danger: jest.fn(),
  info: jest.fn(),
};

function ToastProviderMock() {
  return null;
}

const Toast = { Provider: ToastProviderMock };

module.exports = {
  Button,
  buttonVariants,
  Card,
  TextField,
  Label,
  Input,
  FieldError,
  Select,
  ListBox,
  toast,
  Toast,
};
