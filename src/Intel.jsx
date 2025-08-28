import React, { Suspense, useEffect } from 'react';

const normalizeToDefault = (m, key) => {
  if (key && m[key]) return { default: m[key] };
  if (m?.default) return { default: m.default };
  if (typeof m === 'function') return { default: m };
  throw new Error('Remote module does not export a React component.');
};

const RichTextEditor = React.lazy(() =>
  import('shared_ui/components').then((m) => normalizeToDefault(m, 'RichTextEditor'))
);


const Intel = () => {
  useEffect(() => {
    (async () => {
      const mod = await import('shared_ui/simple');
      console.log('[MF] shared_ui/simple imports:', mod, 'default?', !!mod.default);
    })();
  }, []);


  return (
    <>
      <div>This is main CRA</div>
      <Suspense fallback={<>loading…</>}>
      <div style={{position: 'relative', width: '800px'}}>
        <RichTextEditor />
      </div>
      </Suspense>
    </>
  );
};

export default Intel;
