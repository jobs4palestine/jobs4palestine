type ShowIfProps = {
  condition: boolean;
  children: React.ReactNode;
};
export function ShowIf({ condition, children }: ShowIfProps) {
  return condition ? <>{children}</> : null;
}
