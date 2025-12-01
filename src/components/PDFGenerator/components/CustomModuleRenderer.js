import { renderRichText } from "../utils/pdfUtils";

const CustomModuleRenderer = ({ section, data }) => {
  const moduleData = data?.reduce((acc, module) => {
    if (module.moduleId === section.id) {
      acc = [...acc, ...module.content];
    }
    return acc;
  }, []);

  if (!moduleData?.length) {
    return null;
  }

  return renderRichText(moduleData, section.label);
};

export default CustomModuleRenderer;
