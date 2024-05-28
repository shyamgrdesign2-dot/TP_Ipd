import React, { useContext } from 'react';
import JoditEditor from 'jodit-react';

import EditorContext from '../../../context/EditorContext';

const CustomEditor = () => {
  const editor = React.useRef(null);

  const { content, setContent } = useContext(EditorContext);

  const TOOLBAR = [
    'undo', 'redo', '|', 'ul', 'ol', 'align', 'fontsize', '|', 'bold', 'italic', 'underline', '|', 'source', '|',
    {
      name: 'Insert',
      // iconURL: 'https://img.icons8.com/ios-glyphs/30/000000/menu.png',
      list: {
        option1: `Doctor Name`,
        option2: `Patient Name`,
        option3: `Patient Age`,
        option4: `Patient's Mobile No.`,
        option5: `Gender`,
        option6: `Today's Date`,
        option7: `Custom Date`,
        option8: `Add Text Input`,
        option9: `Email`,
      },

      exec: (editor, current, options, originalEvent, btn) => {
        const selectedOption = options.control.name;
        const content = options.originalEvent.target.textContent;
        if (selectedOption === 'option1') {
          editor.s.insertHTML(`<label>${content}</label>`);
        } else if (selectedOption === 'option2') {
          editor.s.insertHTML(`<label class="ptName">${content}</label>`);
        } else if (selectedOption === 'option3') {
          editor.s.insertHTML(`<label>${content}</label>`);
        } else if (selectedOption === 'option4') {
          editor.s.insertHTML(`<label class="ptNumber">${content}</label>`);
        } else if (selectedOption === 'option5') {
          editor.s.insertHTML(`<label>${content}</label>`);
        } else if (selectedOption === 'option6') {
          editor.s.insertHTML(`<label>${content}</label>`);
        } else if (selectedOption === 'option7') {
          editor.s.insertHTML(`<input type="date" />`);
        } else if (selectedOption === 'option8') {
          editor.s.insertHTML(`<input type="search" />`);
        } else if (selectedOption === 'option9') {
          editor.s.insertHTML(`<label>${content}</label>`);
        }
      }
    }
  ]

  const config = {
    statusbar: false,
    placeholder: 'Write Description...',
    buttons: TOOLBAR,
    buttonsSM: TOOLBAR,
    buttonsMD: TOOLBAR,
    buttonsXS: TOOLBAR,
  };

  return (
    <JoditEditor
      ref={editor}
      value={content.replace(/{Patient Name}/g, '<label class="ptName">Kishan Patel</label>').replace(/{Contact Number}/g, '<label class="ptNumber">8155947450</label>')}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
    // onChange={newContent => onChange(newContent)}
    />
  );
};

export default React.memo(CustomEditor);