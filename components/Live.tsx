import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors';
import { useMyPresence, useOthers } from '@liveblocks/react/suspense';
import CursorChat from './cursor/CursorChat';
import { CursorMode } from '@/types/type';

const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState({
        mode: CursorMode.Hidden,
        previousMessage: null, 
        message: '' 
    }) as any;

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if(e.key === '/'){
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                });
            } else if(e.key === 'Escape'){
                updateMyPresence({message: ''});
                setCursorState({ mode: CursorMode.Hidden });
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if(e.key === '/'){
                e.preventDefault();
            }
        };

        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        }

    },[updateMyPresence]);

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor: {x,y}});
    },[]);

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor: {x,y}});
    },[]);

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        setCursorState({mode: CursorMode.Hidden})

        updateMyPresence({cursor: null, message: null});
    },[]);

  return (
    <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className='h-[100vh] h-full w-full flex justify-center items-center'
    >
      <h1 className="text-2xl text-white">Figma clone</h1>

      {cursor && (
        <CursorChat 
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
        />
      )}

        <LiveCursors others={others} />
    </div>
  )
}

export default Live;