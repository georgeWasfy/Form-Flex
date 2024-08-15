interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  switchTheme: (s: string) => void;
}
const DefaultTopBar = ({ switchTheme }: TopBarProps) => {
  return (
    <div className="fixed w-full z-30 flex bg-gray-200 p-2 items-center justify-center h-16 px-10">
      <div className="logo font-bold transform ease-in-out duration-500 flex-none h-full flex items-center justify-center">
        Form Builder
      </div>
    </div>
  );
};

export default DefaultTopBar;
