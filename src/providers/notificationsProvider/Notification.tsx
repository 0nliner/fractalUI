type NotificationContent = {
    text: string
  };
  
type SnackBarProps = {
    id: string
    content: NotificationContent,
    status: string,
    delete_after?: number
    onClose?: any,
};



const statusesToColors = {
    ERROR: "red",
    INFO: "gray",
    SUCCESS: "green"}


const NotificationComponent = (props: SnackBarProps) => {
    let color = Object.keys(statusesToColors).includes(props.status) ? statusesToColors[props.status]: statusesToColors.INFO;

    return (
        <div style={{borderRadius: "5px",
                     position: "relative",
                     padding: "10px",
                     paddingTop: "20px",
                     borderLeft: `7px solid ${color}`,
                     width: "100%",
                     backgroundColor: "rgb(22, 22, 22)",
                     height: "fit-content"
                     }}>
            {/* <div style={{position: "absolute", right: 6, top: 3, color: 'white'}} onClick={()=>props.onClose(props.id)}>
                закрыть
            </div> */}
            <div style={{color: "gray", fontSize: "10px", textAlign: "left"}}>
                {props.content.text}
            </div>
        </div>
    );
}

export {NotificationComponent};