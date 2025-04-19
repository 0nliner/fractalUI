const PageWrapper = ({children}) => {
    return (
        <div style={{ overflow: "scroll", scrollbarWidth: "none", height: window.innerHeight - 140, width: "100%", borderRadius: "10px" }}>
                {children}
        </div>
    );
}

export default PageWrapper;