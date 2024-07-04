import { useDraggable } from '@dnd-kit/core';
import { Button, cn } from '@engine/design-system';
import { FormElement } from '../types';

export const SidebarBtnElement = ({
  formElement,
}: {
  formElement: FormElement;
}) => {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={'outline'}
      className={cn(
        'flex flex-col gap-2 h-[100px] shadow-lg  w-[100px] cursor-grab',
        draggable.isDragging && 'ring-2 ring-secondary'
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-8 w-8 text-text cursor-grab" />
      <p className="text-xs text-wrap">{label}</p>
    </Button>
  );
};

export const SidebarBtnElementDragOverlay = ({
  formElement,
}: {
  formElement: FormElement;
}) => {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button
      variant={'outline'}
      className="flex flex-col gap-2 h-[100px] w-[100px] cursor-grab ring-2 ring-secondary bg-base-100 "
    >
      <Icon className=" text-wrap text-text cursor-grab" />
      <p className="text-xs ">{label}</p>
    </Button>
  );
};
