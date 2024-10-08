import DesignerSideBar from './DesignerSideBar';
import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core';
import { cn } from '@engine/design-system';
import useDesigner from '../Hooks/useDesigner';
import { ElementsType, FormElements } from '../types';
import ShortUniqueId from 'short-unique-id';
import FormRenderer from '../Renderers/FormRenderer';
import FormContextProvider from '../Context/FormContext';
const Designer = () => {
  const uniqueId = new ShortUniqueId({ length: 16 });
  const {
    dataSchema,
    uiSchema,
    addElementSchemas,
    addElementInPosition,
    addElementInLayout,
    selectedElement,
    setSelectedElement,
  } = useDesigner();

  const dropZone = useDroppable({
    id: `${uniqueId.rnd()}-drop-zone`,
    data: {
      isDesignerDropZone: true,
    },
  });
  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;

      if (isDesignerBtnElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          uniqueId.rnd()
        );
        if (typeof over.id === 'string' && over.id.includes('drop-zone')) {
          addElementSchemas(newElement);
        }
        if (typeof over.id === 'string' && over.id.includes('layout')) {
          addElementInLayout(newElement, over.id.replace('-layout', ''));
        }
        if (
          typeof over.id === 'string' &&
          (over.id.includes('top') || over.id.includes('left'))
        ) {
          const parentKey = over.id.includes('top')
            ? over.id.replace('-top', '')
            : over.id.replace('-left', '');
          addElementInPosition(newElement, parentKey, 'before');
        }
        if (
          typeof over.id === 'string' &&
          (over.id.includes('bottom') || over.id.includes('right'))
        ) {
          const parentKey = over.id.includes('bottom')
            ? over.id.replace('-bottom', '')
            : over.id.replace('-right', '');
          addElementInPosition(newElement, parentKey, 'after');
        }
      }
    },
  });
  return (
    <div className="grid grid-cols-12 gap-4 h-full ">
      <div
        className="p-4 col-span-9"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={dropZone.setNodeRef}
          className={cn(
            'bg-gray-200 max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow  justify-start flex-1 overflow-y-auto',
            dropZone.isOver && 'ring-2 ring-primary-800'
          )}
        >
          {!dropZone.isOver && !uiSchema && (
            <p className="text-3xl mx-80 flex flex-grow items-center font-bold">
              Drop components
            </p>
          )}
          {dropZone.isOver && !uiSchema && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-white"></div>
            </div>
          )}
          <div>
            <FormContextProvider>
              <FormRenderer
                dataSchema={dataSchema}
                uiSchema={uiSchema}
                isDesigner={true}
              />
            </FormContextProvider>
          </div>
        </div>
      </div>
      <DesignerSideBar />
    </div>
  );
};

export default Designer;
