function Button(){

    const styles = {
        backgroundColor: "hsl(200, 100%, 50%)",
        color: "white",
        padding: "10px 20px",
        fontSize: "25px",
        borderRadius:  "5px",
        cursor: "pointer",
    }

    return(
        <button style={styles}>Click Me</button>
    );
}

export default Button