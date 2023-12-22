import { Label } from '@engine/design-system';
import { FormElements } from '../types';
import { SidebarBtnElement } from './SidebarBtnElement';

const FormElementsSideBar = () => {
  return (
    <div>
      <Label>Form Elements</Label>
      <div className="flex flex-row gap-3 mb-2">
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.NumberField} />
      </div>
      <div className="flex flex-row gap-3">
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
      </div>
      <Label>Layouts</Label>
      <div className="flex flex-row gap-3">
        <SidebarBtnElement formElement={FormElements.HorizontalLayout} />
        <SidebarBtnElement formElement={FormElements.VerticalLayout} />
      </div>
    </div>
  );
};

export default FormElementsSideBar;
