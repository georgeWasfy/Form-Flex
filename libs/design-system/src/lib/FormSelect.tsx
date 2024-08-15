import RSelect, { Props, SelectInstance } from 'react-select';
import { cn } from './utils/helpers';
import { ReactElement, Ref, forwardRef } from 'react';

export const FormSelect = forwardRef((props, ref) => {
  return (
    <>
      <RSelect
        ref={ref}
        {...props}
        unstyled
        closeMenuOnSelect={!props.isMulti}
        classNames={{
          container: () => cn(
            'rounded',
            props.isDisabled ? 'opacity-50' : 'opacity-100'
          ),
          placeholder: () => 'text-gray-400 font-sm',
          multiValue: () => 'px-2 py rounded-md flex gap-1 bg-gray-200',
          multiValueLabel: () => 'text-sm',
          control: (props) =>
            cn(
              'bg-transparent  rounded-md ',
              props.menuIsOpen ? 'border-gray-400' : 'border-gray-200',
              
            ),
          valueContainer: (props) => 'pl-2 pr-10 py-0.5 gap-1',
          dropdownIndicator: () => 'mr-2  text-content ',
          menuList: () => 'py-2 rounded-md',
          option: (props) =>
            cn(
              props.isSelected
                ? 'bg-gray-200 text-primary-content px-3 py-2'
                : 'bg-base-100 px-3 py-2 hover:bg-gray-200 bg-base-100'
            ),
        }}
      />
    </>
  );
}) as <Option, isMulti extends boolean = false>(
  props: Props<Option, isMulti> & {ref?: Ref<SelectInstance<Option, isMulti>>}
) => ReactElement;
