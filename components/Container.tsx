export function Container(props: { children: any }) {
  return (
    <div className="p-3 flex flex-col flex-grow gap-2 text-base border-brand border-y-4 h-full min-h-0 bg-[url(~/Assets/paper-bg.jpg)]">
      {props.children}
    </div>
  );
}