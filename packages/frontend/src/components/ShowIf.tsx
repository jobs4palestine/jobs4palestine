type ShowIfProps = {
  condition: boolean;
  children: React.ReactNode;
};
export function ShowIf({ condition, children }: ShowIfProps) {
  console.log("ShowIf rendered", condition);
  return condition ? <>{children}</> : null;
}
