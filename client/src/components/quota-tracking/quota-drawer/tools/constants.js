export const MAX_INPUT_NUMBER = 99;

export const TYPE_OPTIONS = [
  { value: "inperson", label: "In Person" },
  { value: "telehealth", label: "Telehealth" },
];

export const inputStyles = {
  bg: "white",
  borderColor: "gray.300",
  borderRadius: "6px",
  _placeholder: { color: "gray.400" },
  _disabled: { bg: "gray.50", color: "gray.500", opacity: 1 },
};

export const selectStyles = {
  bg: "white",
  borderColor: "gray.300",
  borderRadius: "6px",
  _placeholder: { color: "gray.400" },
  _disabled: { bg: "gray.50", color: "gray.500", opacity: 1 },
};

export const actionMessage = {
  delete: "Please confirm you would like to delete this quota.",
  save: "Please confirm you would like to make these changes to the quota.",
  create:
    "Please confirm you would like to create a new provider with the following information.",
};

export const drawerTitle = {
  delete: "Delete Quota",
  edit: "Edit Quota",
  create: "Create Quota",
};
