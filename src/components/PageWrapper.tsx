const PageWrapper = ({children}) => {
    return (
        <div style={{ overflow: "scroll", scrollbarWidth: "none", height: window.innerHeight - 140, width: "100%"}}>
                {children}
        </div>
    );
}

export default PageWrapper;