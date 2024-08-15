import useDesigner from '../Hooks/useDesigner';
import FormElementsSideBar from './FormElementsSideBar';
import PropertiesFormSideBar from './PropertiesFormSideBar';

const DesignerSideBar = () => {
  const { selectedElement } = useDesigner();
  return (
    <aside className="rounded-xl col-span-3 border-l-2 border-muted p-4 bg-gray-200 border-primary overflow-y-auto">
      {!selectedElement && <FormElementsSideBar />}
      {selectedElement && <PropertiesFormSideBar />}
    </aside>
  );
};

export default DesignerSideBar;
