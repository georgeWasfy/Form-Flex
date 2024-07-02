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
          placeholder: () => 'text-gray-400',
          multiValue: () => 'px-2 py rounded flex gap-1 bg-background',
          multiValueLabel: () => 'text-sm',
          control: (props) =>
            cn(
              'bg-transparent border rounded ',
              props.menuIsOpen ? 'border-secondary' : 'border-gray-200'
            ),
          valueContainer: (props) => 'pl-2 pr-10 py-0.5 gap-1',
          dropdownIndicator: () => 'mr-2  text-content',
          menuList: () => 'py-2 rounded border',
          option: (props) =>
            cn(
              props.isSelected
                ? 'bg-background text-primary-content px-3 py-2'
                : 'bg-base-100 px-3 py-2 hover:bg-background bg-base-100'
            ),
        }}
      />
    </>
  );
}) as <Option, isMulti extends boolean = false>(
  props: Props<Option, isMulti> & {ref?: Ref<SelectInstance<Option, isMulti>>}
) => ReactElement;
