import { useEffect, useState } from 'react';

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    sprint: false,
    interact: false,
    shoot: false,
    reload: false,
    switchView: false,
    mobileX: 0,
    mobileY: 0,
    clothesColor: 'blue',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setActions((prev) => ({ ...prev, moveForward: true })); break;
        case 'KeyS': setActions((prev) => ({ ...prev, moveBackward: true })); break;
        case 'KeyA': setActions((prev) => ({ ...prev, moveLeft: true })); break;
        case 'KeyD': setActions((prev) => ({ ...prev, moveRight: true })); break;
        case 'Space': setActions((prev) => ({ ...prev, jump: true })); break;
        case 'ShiftLeft': setActions((prev) => ({ ...prev, sprint: true })); break;
        case 'KeyE': setActions((prev) => ({ ...prev, interact: true })); break;
        case 'KeyR': setActions((prev) => ({ ...prev, reload: true })); break;
        case 'KeyV': setActions((prev) => ({ ...prev, switchView: true })); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setActions((prev) => ({ ...prev, moveForward: false })); break;
        case 'KeyS': setActions((prev) => ({ ...prev, moveBackward: false })); break;
        case 'KeyA': setActions((prev) => ({ ...prev, moveLeft: false })); break;
        case 'KeyD': setActions((prev) => ({ ...prev, moveRight: false })); break;
        case 'Space': setActions((prev) => ({ ...prev, jump: false })); break;
        case 'ShiftLeft': setActions((prev) => ({ ...prev, sprint: false })); break;
        case 'KeyE': setActions((prev) => ({ ...prev, interact: false })); break;
        case 'KeyR': setActions((prev) => ({ ...prev, reload: false })); break;
        case 'KeyV': setActions((prev) => ({ ...prev, switchView: false })); break;
      }
    };

    const handleMouseDown = () => setActions((prev) => ({ ...prev, shoot: true }));
    const handleMouseUp = () => setActions((prev) => ({ ...prev, shoot: false }));

    const handleMobileMove = (e: any) => {
      setActions((prev) => ({ ...prev, mobileX: e.detail.x, mobileY: e.detail.y }));
    };

    const handleMobileAction = (e: any) => {
      if (e.detail.action === 'changeClothes') {
        setActions((prev) => ({ ...prev, clothesColor: e.detail.value }));
      } else {
        setActions((prev) => ({ ...prev, [e.detail.action]: e.detail.value }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mobile-move', handleMobileMove);
    window.addEventListener('mobile-action', handleMobileAction);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mobile-move', handleMobileMove);
      window.removeEventListener('mobile-action', handleMobileAction);
    };
  }, []);

  return actions;
};
