import classNames from 'classnames/bind'
import styles from './DragDrop.module.scss'
const cx = classNames.bind(styles)

//Icons
import { MdOutlineCenterFocusWeak } from "react-icons/md";
import { useEffect, useState } from 'react';


interface CoordinateType{
    x: number,
    y: number
}
export default function DragDrop() {

    const [currentCoor, setCurrentCoor] = useState<CoordinateType>({x:0, y:0})
    const handleDragDrop = () => {

    }

    // Add event drag
    useEffect(() =>{
        const dragableBtn =  document.getElementById("drag-drop");
        dragableBtn.addEventListener("dragstart", (event:DragEvent) => {
            const x = event.screenX;
            const y = event.screenY;
            setCurrentCoor({x,y})
        });
        dragableBtn.addEventListener("drop", (event: DragEvent) => {
            event.preventDefault();
            const dropX = event.clientX;
            const dropY = event.clientY;
            const details = {x:dropX, y: dropY}
            console.log("x, y", dropX, dropY);
            // window.dragDropEvent(details)
          });
    },[]);
    useEffect(()=>{
        window.document.addEventListener("dragend", (event: DragEvent) => {
            event.preventDefault();
            const dropX = event.clientX;
            const dropY = event.clientY;
            const details = {x:dropX, y: dropY}
            console.log("x, y", dropX, dropY);
            // window.dragDropEvent(details)
          });
    },[])

  return (
    <div>
      <div>
        <span>Hold and drag to a web content area:</span>
        <span id='drag-drop' draggable><MdOutlineCenterFocusWeak size={22}/></span>
      </div>
      <div>
        Current coordinate picked:
        <span>x: {currentCoor.x}; &nbsp;</span>
        <span>y: {currentCoor.y}</span>
      </div>
    </div>
  )
}

