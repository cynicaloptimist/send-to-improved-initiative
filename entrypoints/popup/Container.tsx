export function Container(props: { children: any; }) {
  return (
    <div className="p-3 flex flex-col gap-2 text-base border-brand border-y-4">
      {props.children}
    </div>
  );
}
