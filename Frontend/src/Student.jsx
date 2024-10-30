import propType from 'prop-types'
// props is a javascript object
function Student(props){
    return(
        <div className="student">
            <p>Name: {props.name}</p>
            <p>Age: {props.age}</p>
            <p>Student: {props.isStudent ? "Yes" : "No" }</p>
        </div>
    );
}

Student.defaultProps = {
    name: "Guest",
    age: 0,
    isStudent: false,
}

Student.propType = {
    name: propType.string,
    age: propType.number,
    isStudent: propType.bool,
}

export default Student