export interface SelectionBoxProps {
  onSelectionChange: (selection: { city: string; district: string | undefined }) => void;
  resetSelection: boolean | null;
}