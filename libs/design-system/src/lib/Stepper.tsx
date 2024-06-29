interface IStepper {
  steps: string[];
  activeTabIndex: number;
}

export const Stepper = ({ steps, activeTabIndex }: IStepper) => {
  return (
    <div>
      <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
        <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
          {steps.map((step, i) => (
            <li className="flex items-center p-2" key={i}>
              <span
                className={`h-6 w-6 rounded-full ${
                  activeTabIndex === i
                    ? 'bg-primary/90 text-white'
                    : 'bg-gray-100'
                }  text-center text-[10px] font-bold leading-6`}
              >
                {i + 1}
              </span>

              <span className="hidden sm:ml-2 sm:block"> {step} </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
